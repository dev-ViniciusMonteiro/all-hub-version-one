import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';

const category = {
  name: 'Curiosidades & Tendências',
  slug: 'curiosidades-tendencias',
  description: 'Descubra curiosidades fascinantes e as últimas tendências em diversos assuntos'
};

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Curiosidades e Tendências`,
  description: category.description,
  keywords: ['curiosidades', 'tendências', 'novidades', 'utilidades', 'dicas'],
};

export default function CuriosidadesTendencias() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="curiosidades-tendencias" />
    </>
  );
}