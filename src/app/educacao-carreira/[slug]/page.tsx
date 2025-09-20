import ContentPage from '@/components/layout/ContentPage';

interface Props {
  params: { slug: string };
}

export default function EducacaoCarreiraContentPage({ params }: Props) {
  return <ContentPage params={params} category="educacao-carreira" />;
}