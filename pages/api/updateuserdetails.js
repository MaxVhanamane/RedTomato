import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import { getAuthenticatedUser } from '../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const authUser = getAuthenticatedUser(req);
  if (!authUser) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  await connectDb();

  const { name, address, phone, state, area, city, pin } = req.body || {};

  try {
    const updateData = {};
    if (typeof name === 'string') updateData.name = name.trim();
    if (typeof address === 'string') updateData.address = address.trim();
    if (typeof phone === 'string') updateData.phone = phone.trim();
    if (typeof state === 'string') updateData.state = state.trim();
    if (typeof area === 'string') updateData.area = area.trim();
    if (typeof city === 'string') updateData.city = city.trim();
    if (typeof pin === 'string') updateData.pin = pin.trim();

    const updated = await User.findOneAndUpdate(
      { email: authUser.email },
      updateData,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({ success: true, message: 'Details updated successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
}
