import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'esportes')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Últimas Notícias Esportivas`,
  description: category.description,
  keywords: ['esportes', 'futebol', 'olimpíadas', 'campeonatos', 'notícias esportivas'],
};

export default function EsportesPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="esportes" />
    </>
  );
}