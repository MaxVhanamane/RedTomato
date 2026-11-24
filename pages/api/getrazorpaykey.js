export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const key = process.env.RAZORPAY_KEY_ID;
  return res.status(200).json({ key });
}
