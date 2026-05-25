export interface ICertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  imageUrl: string; // Absolute path or CDN link to certificate image
  verificationUrl?: string; // Live credential verification link
}
