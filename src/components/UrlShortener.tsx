'use client';

import React, { useState } from 'react';
import { isValidUrl, formatUrl } from '@/lib/utils';
import { DarkModeProvider, DarkModeToggle } from './DarkModeProvider';

interface ShortenedUrl {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

function UrlShortenerContent() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState<ShortenedUrl | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [recentUrls, setRecentUrls] = useState<ShortenedUrl[]>([]);

  const fetchRecentUrls = async () => {
    try {
      const response = await fetch('/api/urls');
      if (response.ok) {
        const data = await response.json();
        setRecentUrls(data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch recent URLs:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!url.trim()) {
      setError('Please enter a URL');
      setLoading(false);
      return;
    }

    const formattedUrl = formatUrl(url.trim());
    
    if (!isValidUrl(formattedUrl)) {
      setError('Please enter a valid URL');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: formattedUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to shorten URL');
      }

      const data = await response.json();
      setShortenedUrl(data);
      setUrl('');
      fetchRecentUrls();
    } catch (err) {
      setError('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchRecentUrls();
  }, []);

  const copyToClipboard = async () => {
    if (shortenedUrl) {
      const shortUrl = `${window.location.origin}/${shortenedUrl.short_code}`;
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const deleteUrl = async (shortCode: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shortCode }),
      });

      if (response.ok) {
        fetchRecentUrls();
        if (shortenedUrl?.short_code === shortCode) {
          setShortenedUrl(null);
        }
      } else {
        alert('Failed to delete URL');
      }
    } catch (error) {
      alert('Failed to delete URL');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <DarkModeToggle />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-8 transition-all duration-300 animate-fade-in">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100 animate-slide-down">
          URL Shortener
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your URL here..."
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-300"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/50 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg animate-shake">
            {error}
          </div>
        )}

        {shortenedUrl && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600 animate-slide-up">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Your shortened URL:
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600 font-mono text-sm break-all text-gray-900 dark:text-gray-100">
                  {`${window.location.origin}/${shortenedUrl.short_code}`}
                </div>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 active:scale-95 flex-shrink-0 flex items-center gap-2"
                >
                  {copied ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p><strong>Original URL:</strong> <span className="break-all">{shortenedUrl.original_url}</span></p>
                <p><strong>Clicks:</strong> {shortenedUrl.clicks}</p>
                <p><strong>Created:</strong> {new Date(shortenedUrl.created_at).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {recentUrls.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Recent URLs
              </h3>
              <button
                onClick={fetchRecentUrls}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Refresh
              </button>
            </div>
            <div className="space-y-3">
              {recentUrls.map((urlItem) => (
                <div key={urlItem.id} className="bg-white dark:bg-gray-800 p-3 rounded border dark:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/50 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm text-blue-600 dark:text-blue-400 break-all">
                          {`${window.location.origin}/${urlItem.short_code}`}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 break-all mt-1">
                          {urlItem.original_url}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                          </svg>
                          {urlItem.clicks} clicks
                        </span>
                        <button
                          onClick={() => deleteUrl(urlItem.short_code)}
                          className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-800/50 transition-all duration-300 flex-shrink-0 transform hover:scale-110 flex items-center gap-1"
                          title="Delete URL"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UrlShortener() {
  return (
    <DarkModeProvider>
      <UrlShortenerContent />
    </DarkModeProvider>
  );
}