import { Request, Response } from 'express';
import crypto from 'crypto';

// Secret key loaded from environment or randomized fallback at runtime
const CAPTCHA_SECRET = process.env.CAPTCHA_SECRET || crypto.randomBytes(32).toString('hex');

// HMAC Token Structure: hmac_signature.expiry_timestamp
export const generateCaptcha = (req: Request, res: Response) => {
  try {
    const num1 = crypto.randomInt(1, 11); // Random number between 1 and 10
    const num2 = crypto.randomInt(1, 11);
    const sum = num1 + num2;

    // Token expires in 5 minutes
    const expiry = Date.now() + 5 * 60 * 1000;

    // Create signature based on correct answer and expiry timestamp
    const signature = crypto
      .createHmac('sha256', CAPTCHA_SECRET)
      .update(`${sum}:${expiry}`)
      .digest('hex');

    const token = `${signature}.${expiry}`;

    return res.status(200).json({
      question: `What is ${num1} + ${num2}?`,
      token,
    });
  } catch (error) {
    console.error('[Captcha Controller] Error generating challenge:', error);
    return res.status(500).json({ error: 'Failed to generate security challenge.' });
  }
};

// Cryptographic verification helper
export const verifyCaptcha = (userAnswer: string, token: string): boolean => {
  try {
    if (!userAnswer || !token) return false;

    const parts = token.split('.');
    if (parts.length !== 2) return false;

    const [signature, expiryStr] = parts;
    const expiry = parseInt(expiryStr, 10);

    // 1. Check expiration
    if (isNaN(expiry) || Date.now() > expiry) {
      console.warn('[Captcha Verify] Challenge has expired.');
      return false;
    }

    // 2. Normalize and check numeric answer
    const parsedAnswer = parseInt(userAnswer.trim(), 10);
    if (isNaN(parsedAnswer)) return false;

    // 3. Recompute expected signature
    const expectedSignature = crypto
      .createHmac('sha256', CAPTCHA_SECRET)
      .update(`${parsedAnswer}:${expiry}`)
      .digest('hex');

    // 4. Timing-attack resistant string comparison
    const sigBuffer = Buffer.from(signature, 'hex');
    const expectedBuffer = Buffer.from(expectedSignature, 'hex');

    if (sigBuffer.length !== expectedBuffer.length) return false;

    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch (error) {
    console.error('[Captcha Verify] Verification error:', error);
    return false;
  }
};
