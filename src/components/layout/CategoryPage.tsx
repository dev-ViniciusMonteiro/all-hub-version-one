'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Pagination from '@/components/ui/Pagination';

import { generateBreadcrumbs } from '@/lib/seo';
import { categories } from '@/data/categories';
import { Content, Category } from '@/types';

const ITEMS_PER_PAGE = 5;

interface CategoryPageProps {
  categorySlug: string;
}

export default function CategoryPage({ categorySlug }: CategoryPageProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1');
  
  const category = categories.find(c => c.slug === categorySlug);
  
  useEffect(() => {
    const fetchContents = async () => {
      try {
        const response = await fetch(`/api/${categorySlug}`);
        const result = await response.json();
        if (result.success) {
          setContents(result.data);
        }
      } catch (error) {
        console.error('Erro ao carregar conteúdos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [categorySlug]);

  if (!category) return null;

  const breadcrumbs = generateBreadcrumbs(`/${categorySlug}`);
  
  // Calcular paginação
  const totalItems = contents.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedContents = contents.slice(startIndex, endIndex);

  return (
    <div className="container-main py-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mb-8 text-center border-b-4 border-newspaper-brown pb-6">
        <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
          <span className="text-5xl mb-2 sm:mb-0 sm:mr-4">{category.icon}</span>
          <h1 className="newspaper-headline text-3xl sm:text-5xl md:text-6xl border-none pb-0 mb-0 text-center break-words">{category.name}</h1>
        </div>
        <p className="text-lg text-newspaper-brown max-w-4xl mx-auto font-serif italic leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="ad-space mb-8">
        <p>PUBLICIDADE • ANÚNCIO (728x90)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {paginatedContents.map((content, index) => (
                  <article key={content.id} className="newspaper-article">
                    <div className="newspaper-byline">
                      <time dateTime={content.publishedAt}>
                        {new Date(content.publishedAt).toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          year: 'numeric', 
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <span className="mx-2">•</span>
                      <span>Por {content.author}</span>
                      <span className="mx-2">•</span>
                      <span>{content.readTime} min de leitura</span>
                      {content.views && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{content.views} leitores</span>
                        </>
                      )}
                    </div>
                    

                    
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <h2 className={`${index === 0 ? 'text-3xl md:text-4xl' : 'text-2xl md:text-3xl'} font-headline font-bold text-newspaper-ink leading-tight hover:text-newspaper-red transition-colors flex-1`}>
                        <a href={`/${categorySlug}/${content.slug}`}>
                          {content.title}
                        </a>
                      </h2>
                      <a 
                        href={`/${categorySlug}/${content.slug}`}
                        className="text-newspaper-brown hover:text-newspaper-red font-serif font-semibold uppercase tracking-wide text-xs border-b border-newspaper-brown hover:border-newspaper-red transition-colors mt-2 md:mt-0 md:ml-4 self-start"
                      >
                        Ler mais →
                      </a>
                    </div>
                    
                    <p className="text-newspaper-ink mb-6 text-lg leading-relaxed text-justify">
                      {content.excerpt}
                    </p>
                    
                    <div className="border-t border-newspaper-brown/20 pt-4">
                      <div className="flex flex-wrap gap-2">
                        {content.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-newspaper-brown text-newspaper-cream px-3 py-1 text-xs font-serif font-semibold uppercase tracking-wide">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={`/${categorySlug}`}
              />
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="newspaper-article">
            <h3 className="sidebar-title mb-4 -mx-6 -mt-6 mb-6">MAIS LIDAS</h3>
            <div className="space-y-4">
              {contents.filter(c => c.featured).slice(0, 3).map((content, index) => (
                <a key={content.id} href={`/${categorySlug}/${content.slug}`} className="block hover:text-newspaper-red transition-colors border-b border-newspaper-brown/20 pb-3">
                  <div className="flex items-start space-x-3">
                    <span className="bg-newspaper-red text-newspaper-cream w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-semibold text-sm leading-tight text-newspaper-ink">
                        {content.title}
                      </h4>
                      <p className="text-xs text-newspaper-brown mt-1 font-serif italic">
                        {new Date(content.publishedAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="ad-space">
            <p className="text-sm">PUBLICIDADE<br/>ANÚNCIO (300x250)</p>
          </div>

          <div className="newspaper-article">
            <h3 className="sidebar-title mb-4 -mx-6 -mt-6 mb-6">OUTRAS SEÇÕES</h3>
            <div className="space-y-3">
              {categories.filter(c => c.slug !== categorySlug).slice(0, 5).map((cat) => (
                <a 
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className="flex items-center space-x-3 text-newspaper-brown hover:text-newspaper-red transition-colors py-2 border-b border-newspaper-brown/10"
                >
                  <span className="text-lg">{cat.icon}</span>
                  <span className="font-serif font-semibold text-sm uppercase tracking-wide">{cat.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="ad-space">
            <p className="text-sm">PUBLICIDADE<br/>ANÚNCIO (300x250)</p>
          </div>
        </div>
      </div>
    </div>
  );
}