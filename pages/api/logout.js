import { stringifySetCookie } from 'cookie';

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    stringifySetCookie({
      name: 'token',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      expires: new Date(0),
      path: '/',
    })
  );
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
