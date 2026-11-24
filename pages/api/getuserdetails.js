import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import { getAuthenticatedUser } from '../../middleware/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const authUser = getAuthenticatedUser(req);
  if (!authUser) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  await connectDb();

  try {
    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const { name, email, address, city, state, phone, pin, area, role } = dbUser;
    return res.status(200).json({
      success: true,
      name: name || '',
      email: email || '',
      address: address || '',
      city: city || '',
      state: state || '',
      phone: phone || '',
      pin: pin || '',
      area: area || '',
      role: role || 'user',
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
