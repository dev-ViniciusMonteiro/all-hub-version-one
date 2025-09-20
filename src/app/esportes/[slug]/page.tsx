import ContentPage from '@/components/layout/ContentPage';

interface Props {
  params: { slug: string };
}

export default function EsportesContentPage({ params }: Props) {
  return <ContentPage params={params} category="esportes" />;
}