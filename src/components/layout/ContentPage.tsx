import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import ShareButtons from '@/components/ui/ShareButtons';
import { generateBreadcrumbs } from '@/lib/seo';
import { Content } from '@/types';

interface Props {
  params: { slug: string };
  category: string;
}

async function getContent(slug: string, category: string): Promise<Content | null> {
  try {
    const filePath = path.join(process.cwd(), `src/data/json/${category}.json`);
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: Content[] = JSON.parse(fileContents);
    
    return data.find(item => item.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

export default async function ContentPage({ params, category }: Props) {
  const content = await getContent(params.slug, category);

  if (!content) {
    notFound();
  }

  const breadcrumbs = generateBreadcrumbs(`/${category}/${content.slug}`);

  return (
    <div className="container-main py-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <time dateTime={content.publishedAt}>
              {new Date(content.publishedAt).toLocaleDateString('pt-BR')}
            </time>
            <span className="mx-2">•</span>
            <span>{content.readTime} min de leitura</span>
            <span className="mx-2">•</span>
            <span>Por {content.author}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {content.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {content.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {content.tags.map((tag) => (
              <span key={tag} className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-8">
          <p className="text-gray-500">Espaço para anúncios (728x90)</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="mb-6">
            <ShareButtons 
              title={content.title}
              url={`/${category}/${content.slug}`}
            />
          </div>
          <div className="text-sm text-gray-500">
            Publicado em {new Date(content.publishedAt).toLocaleDateString('pt-BR')}
            {content.views && ` • ${content.views} visualizações`}
          </div>
        </div>
      </article>

      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center mt-8">
        <p className="text-gray-500 text-sm">Anúncio (300x250)</p>
      </div>
    </div>
  );
}