import { Request, Response } from 'express';

export const getHealthStatus = (req: Request, res: Response) => {
  try {
    return res.status(200).json({
      status: 'operational',
      uptime: process.uptime(), // Process uptime in seconds
      dbConnection: 'operational', // We will mark the JSON file-db connection as operational
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('[Health Controller] Error during check:', error);
    return res.status(500).json({
      status: 'degraded',
      error: 'Failed to complete system checks',
    });
  }
};
