import { Metadata } from 'next';
import { promises as fs } from 'fs';
import path from 'path';
import ContentPage from '@/components/layout/ContentPage';
import { generateContentMetadata } from '@/lib/metadata';
import { Content } from '@/types';

interface Props {
  params: { slug: string };
}

async function getContent(slug: string): Promise<Content | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/data/json/esportes.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data: Content[] = JSON.parse(fileContents);
    return data.find(item => item.slug === slug) || null;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = await getContent(params.slug);
  if (!content) {
    return { title: 'Conteúdo não encontrado - HubAll' };
  }
  return generateContentMetadata(content, 'esportes');
}

export default function EsportesContentPage({ params }: Props) {
  return <ContentPage params={params} category="esportes" />;
}