import { Content } from '@/types';

export const contentData: Record<string, Content[]> = {
  noticias: [
    {
      id: '1',
      title: 'Nova Lei de Proteção de Dados Entra em Vigor',
      slug: 'nova-lei-protecao-dados',
      excerpt: 'Entenda as principais mudanças na legislação brasileira sobre proteção de dados pessoais.',
      content: 'Conteúdo completo da notícia sobre a nova lei...',
      category: 'noticias',
      author: 'João Silva',
      publishedAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      tags: ['legislação', 'dados', 'privacidade'],
      readTime: 5,
      featured: true,
      views: 1250
    },
    {
      id: '2',
      title: 'Economia Brasileira Cresce 2.5% no Último Trimestre',
      slug: 'economia-brasileira-cresce',
      excerpt: 'Dados do IBGE mostram crescimento econômico acima das expectativas.',
      content: 'Análise detalhada dos dados econômicos...',
      category: 'noticias',
      author: 'Maria Santos',
      publishedAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      tags: ['economia', 'brasil', 'crescimento'],
      readTime: 7,
      featured: false,
      views: 890
    }
  ],
  curriculo: [
    {
      id: '1',
      title: 'Como Criar um Currículo Profissional em 2024',
      slug: 'como-criar-curriculo-profissional-2024',
      excerpt: 'Guia completo com dicas atualizadas para criar um currículo que se destaque no mercado.',
      content: 'Passo a passo para criar um currículo eficiente...',
      category: 'curriculo',
      author: 'Ana Costa',
      publishedAt: '2024-01-13T09:00:00Z',
      updatedAt: '2024-01-13T09:00:00Z',
      tags: ['currículo', 'carreira', 'emprego'],
      readTime: 8,
      featured: true,
      views: 2100
    }
  ],
  saude: [
    {
      id: '1',
      title: '10 Dicas para Manter a Saúde Mental em Dia',
      slug: '10-dicas-saude-mental',
      excerpt: 'Estratégias práticas para cuidar da sua saúde mental no dia a dia.',
      content: 'Dicas detalhadas sobre saúde mental...',
      category: 'saude',
      author: 'Dr. Carlos Lima',
      publishedAt: '2024-01-12T14:00:00Z',
      updatedAt: '2024-01-12T14:00:00Z',
      tags: ['saúde mental', 'bem-estar', 'qualidade de vida'],
      readTime: 6,
      featured: true,
      views: 1800
    }
  ],
  tecnologia: [
    {
      id: '1',
      title: 'Inteligência Artificial: Tendências para 2024',
      slug: 'ia-tendencias-2024',
      excerpt: 'Principais inovações e tendências em IA que vão marcar este ano.',
      content: 'Análise das tendências em inteligência artificial...',
      category: 'tecnologia',
      author: 'Tech Team',
      publishedAt: '2024-01-11T11:00:00Z',
      updatedAt: '2024-01-11T11:00:00Z',
      tags: ['IA', 'tecnologia', 'inovação'],
      readTime: 9,
      featured: true,
      views: 3200
    }
  ],
  educacao: [
    {
      id: '1',
      title: 'Melhores Cursos Online Gratuitos de 2024',
      slug: 'melhores-cursos-online-gratuitos-2024',
      excerpt: 'Lista atualizada dos melhores cursos gratuitos disponíveis online.',
      content: 'Compilação dos melhores cursos gratuitos...',
      category: 'educacao',
      author: 'Equipe Educação',
      publishedAt: '2024-01-10T08:00:00Z',
      updatedAt: '2024-01-10T08:00:00Z',
      tags: ['educação', 'cursos', 'gratuito'],
      readTime: 12,
      featured: true,
      views: 2800
    }
  ],
  utilidades: [
    {
      id: '1',
      title: 'Calculadora de Imposto de Renda 2024',
      slug: 'calculadora-imposto-renda-2024',
      excerpt: 'Ferramenta gratuita para calcular seu imposto de renda de forma simples.',
      content: 'Como usar a calculadora de IR...',
      category: 'utilidades',
      author: 'Ferramentas Hub',
      publishedAt: '2024-01-09T16:00:00Z',
      updatedAt: '2024-01-09T16:00:00Z',
      tags: ['imposto de renda', 'calculadora', 'finanças'],
      readTime: 4,
      featured: true,
      views: 4500
    }
  ]
};