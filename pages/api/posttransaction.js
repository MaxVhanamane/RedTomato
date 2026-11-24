import connectDb from '../../middleware/mongoose';
import Order from '../../models/orders';
import Food from '../../models/foods';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};

  if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Missing payment verification parameters.' });
  }

  try {
    // 1. Retrieve the authoritative order from DB
    const order = await Order.findOne({ orderId: razorpayOrderId });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // 2. Check for idempotent replay
    if (order.status === 'paid') {
      return res.status(200).json({
        success: true,
        order,
        message: 'Order has already been confirmed as paid.',
      });
    }

    // 3. Cryptographically verify signature using timing-safe comparison
    const body = `${order.orderId}|${razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET)
      .update(body)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const providedBuffer = Buffer.from(razorpaySignature, 'utf8');

    let isValid = false;
    if (expectedBuffer.length === providedBuffer.length) {
      isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    }

    if (!isValid) {
      order.status = 'failed';
      await order.save();
      return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    }

    // 4. Update order status to paid
    order.status = 'paid';
    order.paymentInfo = JSON.stringify({
      razorpayPaymentId,
      razorpayOrderId,
      verifiedAt: new Date().toISOString(),
    });
    await order.save();

    // 5. Atomically decrement food inventory
    if (order.products && typeof order.products === 'object') {
      for (const itemKey of Object.keys(order.products)) {
        const item = order.products[itemKey];
        if (item && item.slug && item.qty) {
          const qty = parseInt(item.qty, 10);
          if (!isNaN(qty) && qty > 0) {
            await Food.updateOne(
              { slug: item.slug },
              { $inc: { availableQty: -qty } }
            );
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      order,
      message: 'Payment Successful. Your order is confirmed!',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error during verification.' });
  }
}
