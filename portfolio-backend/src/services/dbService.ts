import fs from 'fs';
import path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

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
    'cert-datamining': 0,
  },
  messagesCount: 0,
};

class DbService {
  private static instance: DbService;
  private queue: Promise<any> = Promise.resolve();
  private supabase: SupabaseClient | null = null;

  private constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      console.log('[DB Service] Supabase credentials detected. Initializing Supabase client...');
      this.supabase = createClient(supabaseUrl, supabaseKey);
    } else {
      console.log('[DB Service] Supabase credentials not found. Falling back to local JSON file...');
      this.ensureDbExists();
    }
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

  // Serialized asynchronous reader (fallback to JSON file)
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

  // Serialized asynchronous writer (fallback to JSON file)
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
    const cleanPath = pagePath.split('?')[0].replace(/\/$/, '') || '/';

    if (this.supabase) {
      try {
        // Fetch current count
        const { data, error } = await this.supabase
          .from('page_views')
          .select('count')
          .eq('path', cleanPath)
          .maybeSingle();

        if (error) throw error;

        const currentCount = data?.count ?? 0;
        const newCount = currentCount + 1;

        const { error: upsertError } = await this.supabase
          .from('page_views')
          .upsert({ path: cleanPath, count: newCount });

        if (upsertError) throw upsertError;
        console.log(`[DB Service] Supabase: Recorded view for ${cleanPath} (new count: ${newCount})`);
      } catch (err) {
        console.error('[DB Service] Supabase error in recordPageView:', err);
      }
    } else {
      const data = await this.readDb();
      data.pageViews[cleanPath] = (data.pageViews[cleanPath] || 0) + 1;
      await this.writeDb(data);
    }
  }

  // Record a certificate click by ID
  public async recordCertificateClick(certId: string): Promise<void> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('certificate_clicks')
          .select('count')
          .eq('cert_id', certId)
          .maybeSingle();

        if (error) throw error;

        const currentCount = data?.count ?? 0;
        const newCount = currentCount + 1;

        const { error: upsertError } = await this.supabase
          .from('certificate_clicks')
          .upsert({ cert_id: certId, count: newCount });

        if (upsertError) throw upsertError;
        console.log(`[DB Service] Supabase: Recorded click for ${certId} (new count: ${newCount})`);
      } catch (err) {
        console.error('[DB Service] Supabase error in recordCertificateClick:', err);
      }
    } else {
      const data = await this.readDb();
      data.certificateClicks[certId] = (data.certificateClicks[certId] || 0) + 1;
      await this.writeDb(data);
    }
  }

  // Increment nodemailer sent messages counter
  public async incrementMessagesCount(): Promise<void> {
    if (this.supabase) {
      try {
        const { data, error } = await this.supabase
          .from('messages_count')
          .select('count')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        const currentCount = data?.count ?? 0;
        const newCount = currentCount + 1;

        const { error: upsertError } = await this.supabase
          .from('messages_count')
          .upsert({ id: 1, count: newCount });

        if (upsertError) throw upsertError;
        console.log(`[DB Service] Supabase: Incremented message count (new count: ${newCount})`);
      } catch (err) {
        console.error('[DB Service] Supabase error in incrementMessagesCount:', err);
      }
    } else {
      const data = await this.readDb();
      data.messagesCount = (data.messagesCount || 0) + 1;
      await this.writeDb(data);
    }
  }

  // Fetch compiled metrics dashboard stats
  public async getMetrics(): Promise<DbSchema> {
    if (this.supabase) {
      try {
        const [viewsResult, clicksResult, messagesResult] = await Promise.all([
          this.supabase.from('page_views').select('*'),
          this.supabase.from('certificate_clicks').select('*'),
          this.supabase.from('messages_count').select('count').eq('id', 1).maybeSingle(),
        ]);

        if (viewsResult.error) throw viewsResult.error;
        if (clicksResult.error) throw clicksResult.error;
        if (messagesResult.error) throw messagesResult.error;

        const pageViews: Record<string, number> = { ...DEFAULT_DB.pageViews };
        viewsResult.data?.forEach((row: any) => {
          pageViews[row.path] = row.count;
        });

        const certificateClicks: Record<string, number> = { ...DEFAULT_DB.certificateClicks };
        clicksResult.data?.forEach((row: any) => {
          certificateClicks[row.cert_id] = row.count;
        });

        const messagesCount = messagesResult.data?.count ?? 0;

        return {
          pageViews,
          certificateClicks,
          messagesCount,
        };
      } catch (err) {
        console.error('[DB Service] Supabase error in getMetrics. Falling back to local file...', err);
        return await this.readDb();
      }
    } else {
      return await this.readDb();
    }
  }
}

export const db = DbService.getInstance();
