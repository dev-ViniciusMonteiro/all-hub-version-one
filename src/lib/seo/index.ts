import { SEOData, Article, Category } from '@/types';

export const generateSEO = {
  home: (): SEOData => ({
    title: 'HubAll - Hub Universal de Conteúdos',
    description: 'Seu hub completo para notícias, currículos, saúde, tecnologia, educação e utilidades. Conteúdo de qualidade em um só lugar.',
    keywords: ['hub', 'conteúdo', 'notícias', 'currículo', 'saúde', 'tecnologia', 'educação', 'utilidades'],
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'HubAll',
      description: 'Hub universal de conteúdos',
      url: 'https://huball.com.br',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://huball.com.br/buscar?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  }),

  category: (category: Category): SEOData => ({
    title: `${category.name} - HubAll`,
    description: category.description,
    keywords: [category.name.toLowerCase(), 'hub', 'conteúdo'],
    canonical: `https://huball.com.br/${category.slug}`,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.name,
      description: category.description,
      url: `https://huball.com.br/${category.slug}`
    }
  }),

  article: (article: Article): SEOData => ({
    title: `${article.title} - HubAll`,
    description: article.excerpt,
    keywords: article.tags,
    canonical: `https://huball.com.br/${article.category}/${article.slug}`,
    ogImage: article.image || undefined,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      author: {
        '@type': 'Person',
        name: article.author
      },
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      image: article.image || undefined,
      publisher: {
        '@type': 'Organization',
        name: 'HubAll',
        logo: {
          '@type': 'ImageObject',
          url: 'https://huball.com.br/logo.png'
        }
      }
    }
  })
};

export const generateBreadcrumbs = (path: string) => {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Início', href: '/' }];
  
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbs.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? '' : currentPath
    });
  });
  
  return breadcrumbs;
};