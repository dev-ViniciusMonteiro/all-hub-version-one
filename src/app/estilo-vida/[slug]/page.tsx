import ContentPage from '@/components/layout/ContentPage';

interface Props {
  params: { slug: string };
}

export default function EstiloVidaContentPage({ params }: Props) {
  return <ContentPage params={params} category="estilo-vida" />;
}