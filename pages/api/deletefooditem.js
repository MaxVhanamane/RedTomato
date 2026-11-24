import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
import { requireAdmin } from '../../middleware/auth';
import mongoose from 'mongoose';

async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const id = typeof req.body === 'string' ? req.body : req.body?.id || req.body?._id;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid item ID provided.' });
  }

  try {
    const deleted = await Food.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Food item not found.' });
    }
    return res.status(200).json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Deletion failed' });
  }
}

export default requireAdmin(handler);
