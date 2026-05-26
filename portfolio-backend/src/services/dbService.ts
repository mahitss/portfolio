import fs from 'fs';
import path from 'path';

interface DbSchema {
  pageViews: Record<string, number>;
  certificateClicks: Record<string, number>;
  messagesCount: number;
}

const DB_FILE_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../database.json');

const DEFAULT_DB: DbSchema = {
  pageViews: {
    '/': 0,
    '/experience': 0,
    '/certificates': 0,
    '/contact': 0,
    '/metrics': 0,
  },
  certificateClicks: {
    'cert-gemini': 0,
    'cert-hackathon': 0,
    'cert-ml': 0,
    'cert-ai': 0,
    'cert-tata': 0,
    'cert-cyber': 0,
    'cert-data': 0,
  },
  messagesCount: 0,
};


class DbService {
  private static instance: DbService;
  private queue: Promise<any> = Promise.resolve();

  private constructor() {
    this.ensureDbExists();
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  private ensureDbExists() {
    try {
      if (!fs.existsSync(DB_FILE_PATH)) {
        fs.writeFileSync(DB_FILE_PATH, JSON.stringify(DEFAULT_DB, null, 2), 'utf-8');
      }
    } catch (error) {
      console.error('[DB Service] Error ensuring database file exists:', error);
    }
  }

  // Serialized asynchronous reader
  private async readDb(): Promise<DbSchema> {
    return new Promise((resolve) => {
      this.queue = this.queue.then(async () => {
        try {
          this.ensureDbExists();
          const content = await fs.promises.readFile(DB_FILE_PATH, 'utf-8');
          resolve(JSON.parse(content));
        } catch (error) {
          console.error('[DB Service] Read error, loading default schema:', error);
          resolve({ ...DEFAULT_DB });
        }
      });
    });
  }

  // Serialized asynchronous writer
  private async writeDb(data: DbSchema): Promise<void> {
    return new Promise((resolve) => {
      this.queue = this.queue.then(async () => {
        try {
          await fs.promises.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
          resolve();
        } catch (error) {
          console.error('[DB Service] Write error:', error);
          resolve();
        }
      });
    });
  }

  // Record a page view count by route path
  public async recordPageView(pagePath: string): Promise<void> {
    const data = await this.readDb();
    // Normalize path (strip query params, trailing slashes, etc.)
    const cleanPath = pagePath.split('?')[0].replace(/\/$/, '') || '/';
    data.pageViews[cleanPath] = (data.pageViews[cleanPath] || 0) + 1;
    await this.writeDb(data);
  }

  // Record a certificate click by ID
  public async recordCertificateClick(certId: string): Promise<void> {
    const data = await this.readDb();
    data.certificateClicks[certId] = (data.certificateClicks[certId] || 0) + 1;
    await this.writeDb(data);
  }

  // Increment nodemailer sent messages counter
  public async incrementMessagesCount(): Promise<void> {
    const data = await this.readDb();
    data.messagesCount = (data.messagesCount || 0) + 1;
    await this.writeDb(data);
  }

  // Fetch compiled metrics dashboard stats
  public async getMetrics(): Promise<DbSchema> {
    return await this.readDb();
  }
}

export const db = DbService.getInstance();
