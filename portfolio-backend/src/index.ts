import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';
import { getCertificates } from './controllers/certificateController';
import { handleContactForm } from './controllers/contactController';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows client to fetch certificate images served directly by the backend
}));

// CORS Configuration
const whitelist = (process.env.CORS_WHITELIST || 'http://localhost:3000').split(',');
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));

// JSON Parser Middleware
app.use(express.json());

// Serve static images folder
app.use('/images', express.static(path.join(__dirname, '../public/images')));

// API Routes
app.get('/api/certificates', getCertificates);
app.post('/api/contact', handleContactForm);

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Server Error:', err.message || err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`[Backend Engine] Running on http://localhost:${PORT}`);
  console.log(`[CORS Whitelist] Allow origin: ${whitelist.join(', ')}`);
});
