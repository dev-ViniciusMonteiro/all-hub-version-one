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
      
      <article className="max-w-5xl mx-auto">
        <header className="mb-8 text-center border-b-4 border-newspaper-brown pb-8">
          <div className="newspaper-byline text-center border-l-0 pl-0 mb-6">
            <time dateTime={content.publishedAt}>
              {new Date(content.publishedAt).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long', 
                day: 'numeric'
              }).toUpperCase()}
            </time>
            <span className="mx-3">•</span>
            <span>POR {content.author.toUpperCase()}</span>
            <span className="mx-3">•</span>
            <span>{content.readTime} MINUTOS DE LEITURA</span>
          </div>
          
          <h1 className="font-headline font-bold text-4xl md:text-6xl text-newspaper-ink mb-6 leading-tight">
            {content.title}
          </h1>
          
          <p className="text-xl md:text-2xl text-newspaper-brown mb-8 font-serif italic leading-relaxed max-w-4xl mx-auto">
            {content.excerpt}
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {content.tags.map((tag) => (
              <span key={tag} className="bg-newspaper-brown text-newspaper-cream px-4 py-2 text-sm font-serif font-semibold uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="ad-space mb-8">
          <p>PUBLICIDADE • ANÚNCIO (728x90)</p>
        </div>

        <div className="newspaper-column text-lg leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>

        <div className="mt-12 pt-8 border-t-4 border-newspaper-brown">
          <div className="mb-8 text-center">
            <ShareButtons 
              title={content.title}
              url={`/${category}/${content.slug}`}
            />
          </div>
          <div className="text-center text-newspaper-brown font-serif italic">
            Publicado em {new Date(content.publishedAt).toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            {content.views && ` • Lido por ${content.views} pessoas`}
          </div>
        </div>
      </article>

      <div className="ad-space mt-12">
        <p className="text-sm">PUBLICIDADE • ANÚNCIO (300x250)</p>
      </div>
    </div>
  );
}