# URL Shortener

A simple and fast URL shortener built with Next.js, TypeScript, and in-memory storage.

## 🚀 Live Demo

**[Try it live: https://url-shortener-seven-coral.vercel.app/](https://url-shortener-seven-coral.vercel.app/)**

## Features

- ✅ Shorten long URLs
- ✅ Click tracking
- ✅ Responsive design
- ✅ Copy to clipboard
- ✅ URL validation
- ✅ JSON file storage

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How it works

1. Enter a URL in the input field
2. Click "Shorten" to generate a short URL
3. Copy the shortened URL and share it
4. When someone visits the short URL, they'll be redirected to the original URL
5. Click counts are tracked automatically

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **In-Memory Storage** - For serverless deployment
- **nanoid** - Short ID generation

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /[shortCode]` - Redirect to original URL

## Data Structure

```typescript
interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}
```