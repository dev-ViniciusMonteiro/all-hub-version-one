'use client';

import { useState, useEffect } from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-600">Compartilhar:</span>
        <div className="flex space-x-2">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  const shareData = {
    title,
    url: window.location.href,
  };

  const handleShare = async (platform: string) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(shareData.url);

    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
      return;
    }

    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
      <span className="text-sm text-newspaper-brown font-serif font-semibold">Compartilhar:</span>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleShare('whatsapp')}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm font-serif font-semibold hover:bg-green-700 transition-colors"
        >
          <span>💬</span>
          <span>WhatsApp</span>
        </button>

        <button
          onClick={() => handleShare('copy')}
          className={`flex items-center space-x-2 px-4 py-2 text-sm font-serif font-semibold transition-colors ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-newspaper-beige text-newspaper-ink hover:bg-newspaper-cream border border-newspaper-brown'
          }`}
        >
          <span>{copied ? '✅' : '🔗'}</span>
          <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
        </button>
      </div>
    </div>
  );
}