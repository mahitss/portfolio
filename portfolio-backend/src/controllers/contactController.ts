import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { verifyCaptcha } from './captchaController';
import { db } from '../services/dbService';

// Helper to validate email structure
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const handleContactForm = async (req: Request, res: Response) => {
  const { name, email, message, captchaAnswer, captchaToken } = req.body;

  // 1. Validation Layer
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required and must be a non-empty string.' });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
  }

  // 2. CAPTCHA Security Layer
  if (!captchaAnswer || !captchaToken || !verifyCaptcha(captchaAnswer, captchaToken)) {
    return res.status(400).json({ error: 'Security challenge failed. Please solve the arithmetic question again.' });
  }

  try {
    let transporter;

    // Check if custom SMTP credentials are provided
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Dynamically generate an Ethereal SMTP test account
      console.log('No SMTP credentials in .env, creating dynamic Ethereal Test Account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL || 'portfolio-owner@example.com',
      subject: `Portfolio Contact Form: Message from ${name}`,
      text: `You have received a new contact message from your portfolio website:
      
Name: ${name}
Email: ${email}
Message: ${message}`,
      html: `<p>You have received a new contact message from your portfolio website:</p>
             <p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong></p>
             <blockquote style="border-left: 2px solid #ccc; padding-left: 10px; margin-left: 0;">
               ${message.replace(/\n/g, '<br>')}
             </blockquote>`,
    };

    const info = await transporter.sendMail(mailOptions);

    // Increment successfully sent messages counter in our analytics database
    await db.incrementMessagesCount();

    // If using ethereal, output preview URL
    if (!process.env.SMTP_HOST) {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    return res.status(200).json({
      message: 'Message sent successfully!',
      messageId: info.messageId,
      previewUrl: !process.env.SMTP_HOST ? nodemailer.getTestMessageUrl(info) : undefined,
    });
  } catch (error: any) {
    console.error('Nodemailer Error:', error);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
};
