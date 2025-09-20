import ContentPage from '@/components/layout/ContentPage';

interface Props {
  params: { slug: string };
}

export default function SaudeBemEstarContentPage({ params }: Props) {
  return <ContentPage params={params} category="saude-bem-estar" />;
}