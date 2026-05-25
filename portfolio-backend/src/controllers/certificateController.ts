import { Request, Response } from 'express';
import { ICertificate } from '../interfaces/certificate';

const MOCK_CERTIFICATES: ICertificate[] = [
  {
    id: 'cert-1',
    name: 'Advanced React & 3D WebGL Development',
    issuer: 'Metaverse Dev Academy',
    issueDate: '2026-04-15',
    imageUrl: 'http://localhost:5000/images/react_webgl.png',
    verificationUrl: 'https://credly.com'
  },
  {
    id: 'cert-2',
    name: 'Cloud Solutions Architect Certification',
    issuer: 'Apex Cloud Solutions',
    issueDate: '2026-02-28',
    imageUrl: 'http://localhost:5000/images/cloud_arch.png',
    verificationUrl: 'https://credly.com'
  },
  {
    id: 'cert-3',
    name: 'Full-Stack TypeScript Engineering',
    issuer: 'Systemic Tech Academy',
    issueDate: '2025-11-10',
    imageUrl: 'http://localhost:5000/images/react_webgl.png',
    verificationUrl: 'https://credly.com'
  }
];

export const getCertificates = (req: Request, res: Response) => {
  try {
    return res.status(200).json(MOCK_CERTIFICATES);
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
