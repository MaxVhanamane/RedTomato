import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
import { requireAdmin } from '../../middleware/auth';

async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const items = Array.isArray(req.body) ? req.body : [req.body];

  try {
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item._id) continue;

      const updateData = {};
      if (item.title) updateData.title = String(item.title).trim();
      if (item.slug) updateData.slug = String(item.slug).trim();
      if (item.desc) updateData.desc = String(item.desc).trim();
      if (item.img) updateData.img = String(item.img);
      if (item.popularity) updateData.popularity = String(item.popularity);
      if (item.category) updateData.category = String(item.category);
      if (item.price) updateData.price = Array.isArray(item.price) ? item.price : [Number(item.price)];
      if (item.availableQty !== undefined) updateData.availableQty = Number(item.availableQty);

      await Food.findByIdAndUpdate(item._id, updateData, { new: true });
    }

    return res.status(200).json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message || 'Update failed' });
  }
}

export default requireAdmin(handler);
