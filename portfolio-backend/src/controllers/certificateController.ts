import { Request, Response } from 'express';
import { ICertificate } from '../interfaces/certificate';

const REAL_CERTIFICATES: ICertificate[] = [
  {
    id: 'cert-gemini',
    name: 'Google Gemini AI Certification',
    issuer: 'Google',
    issueDate: '2026-05-15',
    imageUrl: '/certs/Gemini google.pdf',
    verificationUrl: 'https://grow.google'
  },
  {
    id: 'cert-hackathon',
    name: 'Snowflake Hackathon Certification of Excellence',
    issuer: 'Snowflake',
    issueDate: '2026-04-30',
    imageUrl: '/certs/snow hacathon certificate.pdf'
  },
  {
    id: 'cert-ml',
    name: 'Machine Learning Masterclass',
    issuer: 'Stanford Online / Coursera',
    issueDate: '2026-04-12',
    imageUrl: '/certs/Machine Learning.pdf'
  },
  {
    id: 'cert-ai',
    name: 'Artificial Intelligence Foundations',
    issuer: 'IBM',
    issueDate: '2026-03-20',
    imageUrl: '/certs/AI.pdf'
  },
  {
    id: 'cert-tata',
    name: 'Tata Virtual Experience Program',
    issuer: 'Tata Group',
    issueDate: '2026-02-28',
    imageUrl: '/certs/tata.pdf'
  },
  {
    id: 'cert-cyber',
    name: 'Cybersecurity Essentials',
    issuer: 'Cisco Networking Academy',
    issueDate: '2026-02-10',
    imageUrl: '/certs/cyber.pdf'
  },
  {
    id: 'cert-data',
    name: 'Data Analytics Specialization',
    issuer: 'Google Career Certificates',
    issueDate: '2026-01-15',
    imageUrl: '/certs/data analytics.pdf'
  }
];

export const getCertificates = (req: Request, res: Response) => {
  try {
    return res.status(200).json(REAL_CERTIFICATES);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

