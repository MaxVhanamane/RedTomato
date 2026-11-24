import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
import { requireAdmin } from '../../middleware/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const items = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Expected an array of food items.' });
  }

  try {
    const saved = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (!item.title || !item.slug || !item.price || !item.category) {
        return res.status(400).json({ success: false, error: `Missing required fields at index ${i}` });
      }

      const food = new Food({
        title: String(item.title).trim(),
        slug: String(item.slug).trim(),
        desc: String(item.desc || '').trim(),
        img: String(item.img || ''),
        popularity: String(item.popularity || 'low'),
        category: String(item.category || 'veg'),
        price: Array.isArray(item.price) ? item.price : [Number(item.price)],
        availableQty: Number(item.availableQty) || 0,
      });

      await food.save();
      saved.push(food);
    }

    return res.status(200).json({ success: true, message: 'Items added successfully', count: saved.length });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to add food items.' });
  }
}

export default requireAdmin(handler);
