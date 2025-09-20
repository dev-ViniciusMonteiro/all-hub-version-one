'use client';

import { useEffect, useState } from 'react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { generateBreadcrumbs } from '@/lib/seo';
import { categories } from '@/data/categories';
import { Content, Category } from '@/types';

interface CategoryPageProps {
  categorySlug: string;
}

export default function CategoryPage({ categorySlug }: CategoryPageProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  
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

  return (
    <div className="container-main py-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <span className="text-4xl mr-4">{category.icon}</span>
          <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl">
          {category.description}
        </p>
      </div>

      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
        <p className="text-gray-500">Espaço para anúncios (728x90)</p>
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
            <div className="space-y-6">
              {contents.map((content) => (
                <article key={content.id} className="card">
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <time dateTime={content.publishedAt}>
                        {new Date(content.publishedAt).toLocaleDateString('pt-BR')}
                      </time>
                      <span className="mx-2">•</span>
                      <span>{content.readTime} min de leitura</span>
                      {content.views && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{content.views} visualizações</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      <a href={`/${categorySlug}/${content.slug}`}>
                        {content.title}
                      </a>
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {content.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {content.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <a 
                        href={`/${categorySlug}/${content.slug}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ler mais →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            <p className="text-gray-500 text-sm">Anúncio (300x250)</p>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Mais Populares</h3>
              <div className="space-y-3">
                {contents.filter(c => c.featured).slice(0, 3).map((content) => (
                  <a key={content.id} href={`/${categorySlug}/${content.slug}`} className="block hover:text-primary-600 transition-colors">
                    <h4 className="font-medium text-sm leading-tight">
                      {content.title}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(content.publishedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Outras Categorias</h3>
              <div className="space-y-2">
                {categories.filter(c => c.slug !== categorySlug).slice(0, 4).map((cat) => (
                  <a 
                    key={cat.id}
                    href={`/${cat.slug}`}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}