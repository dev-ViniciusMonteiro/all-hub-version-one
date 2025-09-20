import Head from 'next/head';
import { SEOData } from '@/types';

interface SEOHeadProps {
  seo: SEOData;
}

export default function SEOHead({ seo }: SEOHeadProps) {
  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="keywords" content={seo.keywords.join(', ')} />
      
      {seo.canonical && <link rel="canonical" href={seo.canonical} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      {seo.canonical && <meta property="og:url" content={seo.canonical} />}
      {seo.ogImage && <meta property="og:image" content={seo.ogImage} />}
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.ogImage && <meta name="twitter:image" content={seo.ogImage} />}
      
      {/* Structured Data */}
      {seo.structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(seo.structuredData)
          }}
        />
      )}
    </Head>
  );
}