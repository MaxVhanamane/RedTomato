import connectDb from '../../middleware/mongoose';
import Food from '../../models/foods';
import { getFoodImage } from '../../utils/imageHelper';

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const page = Math.max(1, parseInt(req.query.page || req.body?.page || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || req.body?.limit || '12', 10)));
  const category = req.query.category || req.body?.category;
  const search = req.query.search || req.body?.search;

  const query = {};
  if (category && category !== 'all') {
    query.category = category;
  }
  if (search && typeof search === 'string' && search.trim().length > 0) {
    query.title = { $regex: search.trim(), $options: 'i' };
  }

  try {
    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const sanitizedFoods = foods.map((f) => ({
      ...f,
      img: getFoodImage(f.img, f.category === 'veg' ? '/assets/veg.png' : '/assets/nonveg.png'),
    }));

    return res.status(200).json({
      success: true,
      foods: sanitizedFoods,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Failed to retrieve food items' });
  }
}
