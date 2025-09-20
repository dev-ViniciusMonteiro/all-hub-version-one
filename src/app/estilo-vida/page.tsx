import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'estilo-vida')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Moda, Beleza e Lifestyle`,
  description: category.description,
  keywords: ['estilo de vida', 'moda', 'beleza', 'decoração', 'lifestyle'],
};

export default function EstiloVidaPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="estilo-vida" />
    </>
  );
}