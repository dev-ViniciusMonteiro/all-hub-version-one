import { Metadata } from 'next';
import CategoryPage from '@/components/layout/CategoryPage';
import { generateSEO } from '@/lib/seo';

const category = {
  id: 'opiniao-colunas',
  name: 'Opinião & Colunas',
  slug: 'opiniao-colunas',
  description: 'Conteúdos sobre opinião & colunas',
  icon: '💭',
  color: '#8b4513'
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