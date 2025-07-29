import { nanoid } from 'nanoid';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'urls.json');

export interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

interface Database {
  urls: UrlRecord[];
}

class FileDatabase {
  private static readDatabase(): Database {
    try {
      if (!fs.existsSync(dbPath)) {
        return { urls: [] };
      }
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { urls: [] };
    }
  }

  private static writeDatabase(data: Database): void {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  }

  static createShortUrl(originalUrl: string): UrlRecord {
    const db = this.readDatabase();
    const id = nanoid();
    const shortCode = nanoid(8);
    
    const newUrl: UrlRecord = {
      id,
      original_url: originalUrl,
      short_code: shortCode,
      created_at: new Date().toISOString(),
      clicks: 0
    };
    
    db.urls.push(newUrl);
    this.writeDatabase(db);
    
    return newUrl;
  }
  
  static getUrlByShortCode(shortCode: string): UrlRecord | null {
    const db = this.readDatabase();
    return db.urls.find(url => url.short_code === shortCode) || null;
  }
  
  static incrementClicks(shortCode: string): UrlRecord | null {
    const db = this.readDatabase();
    const url = db.urls.find(url => url.short_code === shortCode);
    if (url) {
      url.clicks += 1;
      this.writeDatabase(db);
      return url;
    }
    return null;
  }
  
  static getAllUrls(): UrlRecord[] {
    const db = this.readDatabase();
    return db.urls.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static deleteUrl(shortCode: string): boolean {
    const db = this.readDatabase();
    const initialLength = db.urls.length;
    db.urls = db.urls.filter(url => url.short_code !== shortCode);
    
    if (db.urls.length < initialLength) {
      this.writeDatabase(db);
      return true;
    }
    return false;
  }
}

export { FileDatabase as UrlService };
export default FileDatabase;