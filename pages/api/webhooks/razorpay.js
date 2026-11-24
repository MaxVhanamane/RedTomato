import connectDb from '../../../middleware/mongoose';
import Order from '../../../models/orders';
import Food from '../../../models/foods';
import crypto from 'crypto';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_SECRET;
  if (!webhookSecret) {
    return res.status(500).json({ message: 'Webhook secret not configured' });
  }

  const signature = req.headers['x-razorpay-signature'];
  if (!signature) {
    return res.status(400).json({ message: 'Missing Razorpay signature' });
  }

  try {
    const rawBody = await getRawBody(req);
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
    const signatureBuffer = Buffer.from(signature, 'utf8');

    let isValid = false;
    if (expectedBuffer.length === signatureBuffer.length) {
      isValid = crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
    }

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = JSON.parse(rawBody.toString('utf8'));
    await connectDb();

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload?.payment?.entity;
      const razorpayOrderId = paymentEntity?.order_id || event.payload?.order?.entity?.id;

      if (razorpayOrderId) {
        const order = await Order.findOne({ orderId: razorpayOrderId });
        if (order && order.status !== 'paid') {
          order.status = 'paid';
          order.paymentInfo = JSON.stringify({
            webhookReceived: true,
            paymentId: paymentEntity?.id,
            timestamp: new Date().toISOString(),
          });
          await order.save();

          // Decrement inventory
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
        }
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (err) {
    return res.status(500).json({ message: 'Webhook processing error' });
  }
}
