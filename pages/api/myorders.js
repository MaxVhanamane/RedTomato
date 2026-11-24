import connectDb from '../../middleware/mongoose';
import Order from '../../models/orders';
import { getAuthenticatedUser } from '../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authUser = getAuthenticatedUser(req);
  if (!authUser) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDb();

  try {
    const orders = await Order.find({ email: authUser.email, status: 'paid' })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
