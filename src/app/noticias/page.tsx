import { Metadata } from 'next';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import { generateBreadcrumbs, generateSEO } from '@/lib/seo';
import { categories } from '@/data/categories';

const category = categories.find(c => c.slug === 'noticias')!;

export const metadata: Metadata = {
  title: `${category.name} - HubAll`,
  description: category.description,
};

export default function NoticiasPage() {
  const breadcrumbs = generateBreadcrumbs('/noticias');
  const seo = generateSEO.category(category);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(seo.structuredData)
        }}
      />
      
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

        {/* Ad Space - Only on content pages */}
        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-500">Espaço para anúncios (728x90)</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Sample articles */}
              {[1, 2, 3].map((i) => (
                <article key={i} className="card">
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <time dateTime="2024-01-15">15 de Janeiro, 2024</time>
                      <span className="mx-2">•</span>
                      <span>5 min de leitura</span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors">
                      <a href={`/noticias/exemplo-noticia-${i}`}>
                        Exemplo de Notícia {i} - Título Otimizado para SEO
                      </a>
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Resumo da notícia com informações relevantes e palavras-chave estratégicas 
                      para melhor indexação nos mecanismos de busca.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                          Brasil
                        </span>
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                          Política
                        </span>
                      </div>
                      <a 
                        href={`/noticias/exemplo-noticia-${i}`}
                        className="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Ler mais →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ad Space */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Anúncio (300x250)</p>
            </div>

            {/* Popular Articles */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Mais Lidas</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <a key={i} href={`/noticias/popular-${i}`} className="block hover:text-primary-600 transition-colors">
                      <h4 className="font-medium text-sm leading-tight">
                        Notícia Popular {i} - Título Chamativo
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">Há 2 horas</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="card">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Outras Categorias</h3>
                <div className="space-y-2">
                  {categories.filter(c => c.slug !== 'noticias').slice(0, 4).map((cat) => (
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
    </>
  );
}