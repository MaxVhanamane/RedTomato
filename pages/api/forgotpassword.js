import connectDb from '../../middleware/mongoose';
import cryptoRandomString from 'crypto-random-string';
import ForgotPasswordToken from './../../models/forgotpasswordtoken';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import User from '../../models/users';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getMailTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  await connectDb();

  const { email, sendMail, token, newPassword } = req.body || {};

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Branch 1: Request password reset link
  if (sendMail) {
    try {
      const user = await User.findOne({ email: normalizedEmail });

      if (user) {
        const randomToken = cryptoRandomString({ length: 32, type: 'alphanumeric' });
        const expiresIn = Date.now() + 600 * 1000; // 10 minutes

        await ForgotPasswordToken.findOneAndUpdate(
          { email: normalizedEmail },
          { token: randomToken, expiresIn },
          { upsert: true, new: true }
        );

        const resetLink = `${process.env.NEXT_PUBLIC_HOST}/forgotpassword?token=${encodeURIComponent(randomToken)}&email=${encodeURIComponent(normalizedEmail)}`;

        const emailContent = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2>RedTomato - Password Reset Request</h2>
            <p>We received a request to reset your password. Click the link below to set a new password:</p>
            <p style="margin: 20px 0;">
              <a href="${resetLink}" style="background-color: #e53e3e; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            <p><strong>This link will expire in 10 minutes.</strong></p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `;

        const transporter = getMailTransporter();
        const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_ADDRESS;

        await transporter.sendMail({
          from: `"RedTomato Support" <${fromAddress}>`,
          to: normalizedEmail,
          subject: 'Password Reset Link for RedTomato',
          html: emailContent,
        });
      }

      // Always return success to prevent email enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a reset link has been dispatched.',
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Unable to send reset email. Please try again later.',
      });
    }
  }

  // Branch 2: Reset password using token
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ success: false, message: 'Reset token is required.' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
  }

  try {
    const dbToken = await ForgotPasswordToken.findOne({ email: normalizedEmail });

    if (!dbToken) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token. Please request a new link.' });
    }

    if (dbToken.token !== token) {
      return res.status(400).json({ success: false, message: 'Invalid reset token.' });
    }

    if (dbToken.expiresIn < Date.now()) {
      await ForgotPasswordToken.deleteOne({ email: normalizedEmail });
      return res.status(400).json({ success: false, message: 'Reset token has expired. Please request a new link.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findOneAndUpdate({ email: normalizedEmail }, { password: hashedPassword });

    // Invalidate token immediately after single use
    await ForgotPasswordToken.deleteOne({ email: normalizedEmail });

    return res.status(200).json({ success: true, message: 'Password changed successfully! You may now log in.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Internal Server Error. Please try again later.' });
  }
}
