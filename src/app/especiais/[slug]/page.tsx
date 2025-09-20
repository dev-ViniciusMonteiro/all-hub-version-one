import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/layout/ContentPage';

interface Props {
  params: { slug: string };
}

async function getArticle(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/especiais`, {
      cache: 'no-store'
    });
    
    if (!response.ok) return null;
    
    const { data } = await response.json();
    return data.find((article: any) => article.slug === slug);
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Artigo não encontrado - HubAll'
    };
  }

  return {
    title: `${article.title} - HubAll`,
    description: article.excerpt,
    keywords: article.tags,
  };
}

export default async function EspeciaisArticle({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return <ContentPage params={params} category="especiais" />;
}