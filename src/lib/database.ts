import { nanoid } from 'nanoid';

export interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

// In-memory storage for Vercel serverless functions
const urlDatabase: UrlRecord[] = [];

class MemoryDatabase {
  static createShortUrl(originalUrl: string): UrlRecord {
    const id = nanoid();
    const shortCode = nanoid(8);
    
    const newUrl: UrlRecord = {
      id,
      original_url: originalUrl,
      short_code: shortCode,
      created_at: new Date().toISOString(),
      clicks: 0
    };
    
    urlDatabase.push(newUrl);
    return newUrl;
  }
  
  static getUrlByShortCode(shortCode: string): UrlRecord | null {
    return urlDatabase.find(url => url.short_code === shortCode) || null;
  }
  
  static incrementClicks(shortCode: string): UrlRecord | null {
    const url = urlDatabase.find(url => url.short_code === shortCode);
    if (url) {
      url.clicks += 1;
      return url;
    }
    return null;
  }
  
  static getAllUrls(): UrlRecord[] {
    return urlDatabase.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  static deleteUrl(shortCode: string): boolean {
    const initialLength = urlDatabase.length;
    const index = urlDatabase.findIndex(url => url.short_code === shortCode);
    
    if (index !== -1) {
      urlDatabase.splice(index, 1);
      return true;
    }
    return false;
  }
}

export { MemoryDatabase as UrlService };
export default MemoryDatabase;