import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'educacao-carreira')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Cursos e Oportunidades`,
  description: category.description,
  keywords: ['educação', 'carreira', 'cursos', 'empregos', 'desenvolvimento'],
};

export default function EducacaoCarreiraPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="educacao-carreira" />
    </>
  );
}