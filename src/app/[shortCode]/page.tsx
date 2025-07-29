'use client';

import { useEffect, useState, useRef } from 'react';
import { UrlService } from '@/lib/database';

interface Props {
  params: {
    shortCode: string;
  };
}

interface UrlRecord {
  id: string;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

export default function RedirectPage({ params }: Props) {
  const { shortCode } = params;
  const [urlRecord, setUrlRecord] = useState<UrlRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasRunRef = useRef(false);

  useEffect(() => {
    const handleRedirect = async () => {
      if (hasRunRef.current) return;
      hasRunRef.current = true;
      
      try {
        // Get URL record
        const response = await fetch('/api/click', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ shortCode }),
        });

        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUrlRecord(data);
        
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = data.original_url;
        }, 1000);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    handleRedirect();
  }, [shortCode]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecting...</h1>
          <p className="text-gray-600">Please wait while we redirect you to your destination.</p>
        </div>
      </div>
    );
  }

  if (error || !urlRecord) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">URL Not Found</h1>
          <p className="text-gray-600 mb-6">
            The shortened URL you're looking for doesn't exist or has been removed.
          </p>
          <a 
            href="/" 
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create New Short URL
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-green-600 mb-2">Redirecting to:</h1>
        <p className="text-gray-600 mb-4 break-all">{urlRecord.original_url}</p>
        <p className="text-sm text-gray-500">Click #{urlRecord.clicks}</p>
        <p className="text-xs text-gray-400 mt-2">If you're not redirected automatically, 
          <a href={urlRecord.original_url} className="text-blue-600 hover:underline">click here</a>
        </p>
      </div>
    </div>
  );
}