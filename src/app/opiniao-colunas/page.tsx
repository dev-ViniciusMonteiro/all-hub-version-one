import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';

const category = {
  name: 'Opinião & Colunas',
  slug: 'opiniao-colunas',
  description: 'Artigos de opinião, colunas e análises dos principais colunistas do país'
};

export const metadata: Metadata = {
  title: `${category.name} - HubAll | Opinião e Colunas`,
  description: category.description,
  keywords: ['opinião', 'colunas', 'análise', 'editorial', 'comentários'],
};

export default function OpiniaoColunas() {
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      <CategoryPage categorySlug="opiniao-colunas" />
    </>
  );
}