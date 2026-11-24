import connectDb from '../../middleware/mongoose';
import User from '../../models/users';
import bcrypt from 'bcryptjs';
import { AES, enc } from 'crypto-js';
import jwt from 'jsonwebtoken';
import { stringifySetCookie } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const { email, password } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Please enter valid email and password.' });
  }

  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    let isMatch = false;

    // Check modern bcrypt hash
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Check legacy AES ciphertext and migrate transparently to bcrypt
      try {
        const bytes = AES.decrypt(user.password, process.env.JWT_SECRET);
        const decryptedPass = bytes.toString(enc.Utf8);
        if (decryptedPass === password) {
          isMatch = true;
          // Transparently upgrade legacy password to bcrypt
          user.password = await bcrypt.hash(password, 12);
          await user.save();
        }
      } catch (decryptErr) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password.' });
    }

    // Include role inside the signed JWT
    const jwtToken = jwt.sign(
      {
        name: user.name,
        email: user.email,
        role: user.role || 'user',
      },
      process.env.JWT_SECRET,
      { expiresIn: '3d' }
    );

    // Set secure HttpOnly cookie
    res.setHeader(
      'Set-Cookie',
      stringifySetCookie({
        name: 'token',
        value: jwtToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3 * 24 * 60 * 60,
        path: '/',
      })
    );

    return res.status(200).json({
      success: true,
      email: user.email,
      name: user.name,
      role: user.role || 'user',
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Internal Server Error. Please try again later.' });
  }
}
