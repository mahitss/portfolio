import request from 'supertest';
import express from 'express';

// 1. Register the Nodemailer mock in Jest's cache first
jest.mock('nodemailer', () => {
  return {
    __esModule: true,
    default: {
      createTransport: () => ({
        sendMail: () => Promise.resolve({ messageId: 'mocked-message-id' }),
      }),
      createTestAccount: () => Promise.resolve({
        user: 'test-user@ethereal.email',
        pass: 'test-password',
      }),
      getTestMessageUrl: () => 'https://ethereal.email/preview/mocked-message-id',
    }
  };
});

// 2. Load the controllers using require to guarantee the mock is applied
const { getCertificates } = require('../controllers/certificateController');
const { handleContactForm } = require('../controllers/contactController');
const { getHealthStatus } = require('../controllers/healthController');
const { generateCaptcha } = require('../controllers/captchaController');

// Initialize a testing instance of Express
const app = express();
app.use(express.json());
app.get('/api/certificates', getCertificates);
app.post('/api/contact', handleContactForm);
app.get('/api/captcha', generateCaptcha);
app.get('/api/health', getHealthStatus);

describe('Portfolio Backend API Routing Tests', () => {
  
  describe('GET /api/certificates', () => {
    it('should return 200 OK and serve a typed list of certificates', async () => {
      const res = await request(app).get('/api/certificates');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty('id');
      expect(res.body[0]).toHaveProperty('name');
      expect(res.body[0]).toHaveProperty('imageUrl');
    });
  });

  describe('GET /api/health', () => {
    it('should return 200 OK and report uptime stats', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('operational');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body.dbConnection).toBe('operational');
    });
  });

  describe('GET /api/captcha', () => {
    it('should return 200 OK and return a math question with token', async () => {
      const res = await request(app).get('/api/captcha');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('question');
      expect(res.body).toHaveProperty('token');
      expect(typeof res.body.question).toBe('string');
      expect(res.body.question.startsWith('What is')).toBe(true);
    });
  });

  describe('POST /api/contact', () => {
    it('should reject requests with missing body elements with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({ name: 'Mahit' }); // Missing email/message/captcha
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should reject invalid email formatting with 400 Bad Request', async () => {
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Mahit',
          email: 'invalid-email-format',
          message: 'Hello World',
          captchaAnswer: '5',
          captchaToken: 'dummyToken',
        });
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('email');
    });

    it('should reject invalid CAPTCHA answer with 400 Bad Request', async () => {
      // Get a real captcha challenge first
      const captchaRes = await request(app).get('/api/captcha');
      const { token } = captchaRes.body;

      // Send a wrong answer (e.g. -999 which cannot be the sum of 1-10 + 1-10)
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Mahit',
          email: 'mahit@example.com',
          message: 'Hello World',
          captchaAnswer: '-999',
          captchaToken: token,
        });
      
      expect(res.status).toBe(400);
      expect(res.body.error).toContain('Security challenge failed');
    });

    it('should succeed with 200 OK when CAPTCHA is correctly solved', async () => {
      // Get a real captcha challenge
      const captchaRes = await request(app).get('/api/captcha');
      const { question, token } = captchaRes.body;

      // Extract values from: "What is A + B?"
      const matches = question.match(/What is (\d+) \+ (\d+)\?/);
      expect(matches).not.toBeNull();
      
      const num1 = parseInt(matches![1], 10);
      const num2 = parseInt(matches![2], 10);
      const correctAnswer = (num1 + num2).toString();

      // Submit correct form
      const res = await request(app)
        .post('/api/contact')
        .send({
          name: 'Mahit',
          email: 'mahit@example.com',
          message: 'Secure full-stack test message body.',
          captchaAnswer: correctAnswer,
          captchaToken: token,
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toContain('successfully');
      expect(res.body).toHaveProperty('messageId');
    });
  });
});
