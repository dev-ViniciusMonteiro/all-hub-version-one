import { Metadata } from 'next';
import { Content } from '@/types';

export function generateContentMetadata(content: Content, category: string): Metadata {
  const currentUrl = `https://huball.com.br/${category}/${content.slug}`;

  return {
    title: `${content.title} - HubAll`,
    description: content.excerpt,
    openGraph: {
      title: content.title,
      description: content.excerpt,
      url: currentUrl,
      siteName: 'HubAll - Jornal Digital',
      images: content.image ? [{
        url: content.image,
        width: 1200,
        height: 630,
        alt: content.title,
      }] : undefined,
      type: 'article',
      publishedTime: content.publishedAt,
      authors: [content.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.excerpt,
      images: content.image ? [content.image] : undefined,
    }
  };
}