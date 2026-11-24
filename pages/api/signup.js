import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import bcrypt from 'bcryptjs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const { name, email, password } = req.body || {};

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, error: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ success: false, error: 'Password must be at least 8 characters long.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Sorry! A user with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
    });

    await user.save();
    return res.status(201).json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
}
