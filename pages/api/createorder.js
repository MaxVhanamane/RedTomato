import connectDb from '../../middleware/mongoose';
import Razorpay from 'razorpay';
import Order from '../../models/orders';
import Food from '../../models/foods';
import { getFoodImage } from '../../utils/imageHelper';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{10}$/;
const PIN_REGEX = /^\d{6}$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const { cart, name, email, phone, pin, address, area, city, state } = req.body || {};

  // Validate form details
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Please enter your full name.' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
  }

  if (!phone || !PHONE_REGEX.test(String(phone).trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit phone number.' });
  }

  if (!pin || !PIN_REGEX.test(String(pin).trim())) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 6-digit pincode.' });
  }

  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'Please enter your delivery address.' });
  }

  if (!cart || typeof cart !== 'object' || Object.keys(cart).length === 0) {
    return res.status(400).json({ success: false, error: 'Your cart is empty. Please add items to checkout.' });
  }

  try {
    // Collect all slugs and batch query MongoDB
    const slugs = Object.keys(cart).map((k) => cart[k].slug).filter(Boolean);
    const dbFoods = await Food.find({ slug: { $in: slugs } });
    const foodMap = new Map(dbFoods.map((f) => [f.slug, f]));

    const sizeIndex = { small: 0, medium: 1, large: 2 };
    let serverCalculatedSubtotal = 0;
    let firstItemImg = '';

    for (const itemKey of Object.keys(cart)) {
      const cartItem = cart[itemKey];
      const food = foodMap.get(cartItem.slug);

      if (!food) {
        return res.status(400).json({
          cartTempered: true,
          success: false,
          error: `Item "${itemKey}" is no longer available in our menu.`,
        });
      }

      if (!firstItemImg && food.img) {
        firstItemImg = getFoodImage(food.img);
      }
      if (cartItem.img) {
        cartItem.img = getFoodImage(cartItem.img);
      }

      const sIdx = sizeIndex[cartItem.size];
      if (sIdx === undefined) {
        return res.status(400).json({
          cartTempered: true,
          success: false,
          error: `Invalid size selected for "${itemKey}".`,
        });
      }

      const authoritativePrice = food.price[sIdx];
      if (authoritativePrice === undefined || authoritativePrice !== cartItem.price) {
        return res.status(200).json({
          cartTempered: true,
          success: false,
          error: `The price for "${itemKey}" has changed. Your cart has been updated.`,
        });
      }

      const qty = parseInt(cartItem.qty, 10);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          cartTempered: true,
          success: false,
          error: `Invalid quantity for "${itemKey}".`,
        });
      }

      if (food.availableQty < qty) {
        return res.status(200).json({
          success: false,
          error: `Sorry! Only ${food.availableQty} units of "${food.title}" are available right now.`,
        });
      }

      serverCalculatedSubtotal += authoritativePrice * qty;
    }

    if (serverCalculatedSubtotal <= 0) {
      return res.status(400).json({ success: false, error: 'Order total must be greater than zero.' });
    }

    const amountInPaise = serverCalculatedSubtotal * 100;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    const newOrder = new Order({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      paymentInfo: '',
      orderId: razorpayOrder.id,
      address: address.trim(),
      pin: String(pin).trim(),
      phone: String(phone).trim(),
      area: (area || '').trim(),
      city: (city || '').trim(),
      state: (state || '').trim(),
      amount: serverCalculatedSubtotal,
      products: cart,
      img: firstItemImg || '',
      status: 'pending',
    });

    await newOrder.save();

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      calculatedTotal: serverCalculatedSubtotal,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Payment initiation failed.' });
  }
}
