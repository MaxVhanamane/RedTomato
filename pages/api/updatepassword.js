import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import bcrypt from 'bcryptjs';
import { AES, enc } from 'crypto-js';
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

  const { password, newPassword } = req.body || {};

  if (!password || !newPassword) {
    return res.status(400).json({ success: false, message: 'Please provide both current and new password.' });
  }

  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  try {
    const dbUser = await User.findOne({ email: authUser.email });
    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let isMatch = false;
    if (dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, dbUser.password);
    } else {
      try {
        const bytes = AES.decrypt(dbUser.password, process.env.JWT_SECRET);
        const decryptedPass = bytes.toString(enc.Utf8);
        if (decryptedPass === password) {
          isMatch = true;
        }
      } catch (e) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Your old password is incorrect.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    dbUser.password = hashedNewPassword;
    await dbUser.save();

    return res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal server error. Please try again later.' });
  }
}
