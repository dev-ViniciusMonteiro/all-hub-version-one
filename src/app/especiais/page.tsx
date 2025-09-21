import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';

const category = {
  id: 'especiais',
  name: 'Especiais',
  slug: 'especiais',
  description: 'Conteúdos sobre especiais',
  icon: '⭐',
  color: '#8b4513'
};

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Conteúdos Especiais`,
  description: category.description,
  keywords: ['especiais', 'reportagens', 'exclusivo', 'aprofundado', 'currículo'],
};

export default function Especiais() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="especiais" />
    </>
  );
}