import { Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'noticias',
    name: 'Notícias',
    slug: 'noticias',
    description: 'Últimas notícias e acontecimentos do Brasil e mundo',
    icon: '📰',
    color: 'bg-blue-500'
  },
  {
    id: 'curriculo',
    name: 'Currículo',
    slug: 'curriculo',
    description: 'Dicas, templates e ferramentas para criar currículos profissionais',
    icon: '📄',
    color: 'bg-green-500'
  },
  {
    id: 'saude',
    name: 'Saúde',
    slug: 'saude',
    description: 'Informações sobre saúde, bem-estar e qualidade de vida',
    icon: '🏥',
    color: 'bg-red-500'
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    slug: 'tecnologia',
    description: 'Novidades em tecnologia, programação e inovação',
    icon: '💻',
    color: 'bg-purple-500'
  },
  {
    id: 'educacao',
    name: 'Educação',
    slug: 'educacao',
    description: 'Recursos educacionais, cursos e desenvolvimento pessoal',
    icon: '📚',
    color: 'bg-yellow-500'
  },
  {
    id: 'utilidades',
    name: 'Utilidades',
    slug: 'utilidades',
    description: 'Ferramentas úteis, calculadoras e recursos práticos',
    icon: '🛠️',
    color: 'bg-gray-500'
  }
];