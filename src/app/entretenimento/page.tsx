import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'entretenimento')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Cinema, Música e TV`,
  description: category.description,
  keywords: ['entretenimento', 'cinema', 'música', 'tv', 'celebridades'],
};

export default function EntretenimentoPage() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="entretenimento" />
    </>
  );
}