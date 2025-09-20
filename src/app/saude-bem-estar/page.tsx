import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'saude-bem-estar')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Notícias de Saúde e Bem-Estar`,
  description: category.description,
  keywords: ['saúde', 'bem-estar', 'medicina', 'qualidade de vida', 'dicas de saúde'],
};

export default function SaudeBemEstarPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="saude-bem-estar" />
    </>
  );
}