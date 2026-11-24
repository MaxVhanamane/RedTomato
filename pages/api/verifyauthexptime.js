import jwt from 'jsonwebtoken';
import { getAuthenticatedUser } from '../../middleware/auth';

export default function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(200).json({ success: false, error: 'Token expired or invalid' });
  }

  return res.status(200).json({ success: true, user });
}
