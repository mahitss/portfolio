import { Request, Response } from 'express';
import { ICertificate } from '../interfaces/certificate';

const REAL_CERTIFICATES: ICertificate[] = [
  {
    id: 'cert-sre',
    name: 'Site Reliability Engineering',
    issuer: 'Simplilearn SkillUp',
    issueDate: 'Jul 2026',
    imageUrl: '',
    verificationUrl: 'https://www.simplilearn.com/skillup-free-online-courses'
  },
  {
    id: 'cert-gemini',
    name: 'Gemini for Google Workspace',
    issuer: 'Google',
    issueDate: 'May 2026',
    imageUrl: '/certs/Gemini google.pdf',
    verificationUrl: 'https://grow.google'
  },
  {
    id: 'cert-hackathon',
    name: 'SnowStorm Hackathon Certificate of Excellence',
    issuer: 'Tech4Hack',
    issueDate: 'Apr 2026',
    imageUrl: '/certs/snow hacathon certificate.pdf'
  },
  {
    id: 'cert-ml',
    name: 'Machine Learning Using Python',
    issuer: 'NPTEL',
    issueDate: 'May 2026',
    imageUrl: '/certs/Machine Learning.pdf'
  },
  {
    id: 'cert-ai',
    name: 'Introduction to Artificial Intelligence',
    issuer: 'NPTEL',
    issueDate: 'May 2026',
    imageUrl: '/certs/AI.pdf'
  },
  {
    id: 'cert-tata',
    name: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'TATA via Forage',
    issueDate: 'Oct 2025',
    imageUrl: '/certs/tata.pdf'
  },
  {
    id: 'cert-cyber',
    name: 'Cyber Job Simulation',
    issuer: 'Deloitte via Forage',
    issueDate: 'Oct 2025',
    imageUrl: '/certs/cyber.pdf'
  },
  {
    id: 'cert-data',
    name: 'Data Analytics Job Simulation',
    issuer: 'Deloitte via Forage',
    issueDate: 'Oct 2025',
    imageUrl: '/certs/data analytics.pdf'
  },
  {
    id: 'cert-datamining',
    name: 'Data Mining',
    issuer: 'NPTEL - IIT Kharagpur (Swayam)',
    issueDate: 'Jan-Mar 2026',
    imageUrl: '', // No PDF file, verification only or placeholder
    verificationUrl: 'https://swayam.gov.in'
  }
];

export const getCertificates = (req: Request, res: Response) => {
  try {
    return res.status(200).json(REAL_CERTIFICATES);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

