import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'tecnologia')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Notícias de Tech e Inovação`,
  description: category.description,
  keywords: ['tecnologia', 'inovação', 'gadgets', 'inteligência artificial', 'tech news'],
};

export default function TecnologiaPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="tecnologia" />
    </>
  );
}