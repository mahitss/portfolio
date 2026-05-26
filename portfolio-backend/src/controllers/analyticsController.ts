import { Request, Response } from 'express';
import { db } from '../services/dbService';

// Record a visitor viewing a page route
export const recordPageView = async (req: Request, res: Response) => {
  const { path } = req.body;
  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Path parameter is required and must be a string.' });
  }

  try {
    await db.recordPageView(path);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Analytics Controller] Error recording page view:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Record a visitor clicking a certificate preview link
export const recordCertificateClick = async (req: Request, res: Response) => {
  const { certId } = req.body;
  if (!certId || typeof certId !== 'string') {
    return res.status(400).json({ error: 'CertId parameter is required and must be a string.' });
  }

  try {
    await db.recordCertificateClick(certId);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[Analytics Controller] Error recording certificate click:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Retrieve aggregated metrics for the metrics dashboard
export const getMetrics = async (req: Request, res: Response) => {
  try {
    const metrics = await db.getMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('[Analytics Controller] Error fetching metrics:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
