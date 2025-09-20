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

    const urls = {
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    };

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

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-600">Compartilhar:</span>
      
      <button
        onClick={() => handleShare('whatsapp')}
        className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
      >
        <span>📱</span>
        <span className="text-sm">WhatsApp</span>
      </button>

      <button
        onClick={() => handleShare('facebook')}
        className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        <span>📘</span>
        <span className="text-sm">Facebook</span>
      </button>

      <button
        onClick={() => handleShare('twitter')}
        className="flex items-center space-x-1 px-3 py-1 bg-sky-500 text-white rounded hover:bg-sky-600 transition-colors"
      >
        <span>🐦</span>
        <span className="text-sm">Twitter</span>
      </button>

      <button
        onClick={() => handleShare('copy')}
        className={`flex items-center space-x-1 px-3 py-1 rounded transition-colors ${
          copied 
            ? 'bg-green-500 text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        <span>{copied ? '✅' : '🔗'}</span>
        <span className="text-sm">{copied ? 'Copiado!' : 'Copiar'}</span>
      </button>
    </div>
  );
}