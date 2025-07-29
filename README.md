# URL Shortener

A simple and fast URL shortener built with Next.js, TypeScript, and SQLite.

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
yarn install
```

2. Run the development server:
```bash
yarn dev
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
- **JSON** - File-based storage
- **nanoid** - Short ID generation

## API Endpoints

- `POST /api/shorten` - Create a shortened URL
- `GET /[shortCode]` - Redirect to original URL

## Data Structure

```json
{
  "urls": [
    {
      "id": "unique-id",
      "original_url": "https://example.com",
      "short_code": "abc123",
      "created_at": "2024-01-01T00:00:00.000Z",
      "clicks": 0
    }
  ]
}
```