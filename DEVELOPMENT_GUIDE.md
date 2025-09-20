# Guia de Desenvolvimento - HubAll

## 🎯 Princípios de Desenvolvimento

### 1. **Componentização Inteligente**
- **Regra de Ouro**: Se um elemento aparece 2+ vezes, vira componente
- **Atomic Design**: Atoms → Molecules → Organisms → Templates → Pages
- **Single Responsibility**: Cada componente tem uma única função

### 2. **Padrões de Nomenclatura**
```
Componentes: PascalCase (CategoryCard, ArticleList)
Arquivos: kebab-case (category-card.tsx, article-list.tsx)
Pastas: kebab-case (components/ui, lib/utils)
Variáveis: camelCase (categoryData, articleCount)
```

## 🏗️ Estrutura de Componentes

### **Hierarquia Recomendada**
```
src/components/
├── ui/                 # Componentes básicos reutilizáveis
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── layout/             # Componentes de estrutura
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── seo/               # Componentes específicos de SEO
│   ├── SEOHead.tsx
│   ├── Breadcrumbs.tsx
│   └── StructuredData.tsx
├── content/           # Componentes de conteúdo
│   ├── ArticleCard.tsx
│   ├── CategoryGrid.tsx
│   ├── ArticleList.tsx
│   └── FeaturedContent.tsx
└── forms/             # Componentes de formulários
    ├── ContactForm.tsx
    ├── SearchForm.tsx
    └── NewsletterForm.tsx
```

## 📋 Padrões de Criação

### **1. Componente Base (Template)**
```tsx
// src/components/ui/ComponentName.tsx
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ComponentNameProps {
  children?: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function ComponentName({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ComponentNameProps) {
  return (
    <div 
      className={clsx(
        'base-styles',
        {
          'variant-primary': variant === 'primary',
          'variant-secondary': variant === secondary,
          'size-sm': size === 'sm',
          'size-md': size === 'md',
          'size-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### **2. Página de Categoria (Template)**
```tsx
// src/app/[categoria]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CategoryLayout from '@/components/layout/CategoryLayout';
import { categories } from '@/data/categories';
import { generateSEO } from '@/lib/seo';

interface CategoryPageProps {
  params: { categoria: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = categories.find(c => c.slug === params.categoria);
  if (!category) return {};
  
  const seo = generateSEO.category(category);
  return {
    title: seo.title,
    description: seo.description,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categories.find(c => c.slug === params.categoria);
  
  if (!category) {
    notFound();
  }

  return <CategoryLayout category={category} />;
}

export async function generateStaticParams() {
  return categories.map(category => ({
    categoria: category.slug,
  }));
}
```

## 🔄 Padrões de Atualização

### **1. Adicionando Nova Categoria**

**Passo 1**: Atualizar dados
```tsx
// src/data/categories.ts
export const categories: Category[] = [
  // ... categorias existentes
  {
    id: 'nova-categoria',
    name: 'Nova Categoria',
    slug: 'nova-categoria',
    description: 'Descrição da nova categoria',
    icon: '🆕',
    color: 'bg-indigo-500'
  }
];
```

**Passo 2**: Criar estrutura de pastas
```bash
mkdir src/app/nova-categoria
```

**Passo 3**: Implementar página
```tsx
// src/app/nova-categoria/page.tsx
// Usar template de categoria existente
```

**Passo 4**: Atualizar sitemap
```tsx
// src/app/api/sitemap/route.ts
// Automático via categories array
```

### **2. Criando Novo Componente**

**Checklist de Criação**:
- [ ] Definir interface TypeScript
- [ ] Implementar variantes (size, variant, state)
- [ ] Adicionar className customizável
- [ ] Documentar props no JSDoc
- [ ] Criar stories (se usando Storybook)
- [ ] Adicionar testes unitários

### **3. Modificando Componente Existente**

**Regras de Modificação**:
- ✅ **PODE**: Adicionar props opcionais
- ✅ **PODE**: Adicionar variantes
- ✅ **PODE**: Melhorar acessibilidade
- ❌ **NÃO PODE**: Remover props existentes
- ❌ **NÃO PODE**: Mudar comportamento padrão
- ❌ **NÃO PODE**: Quebrar backward compatibility

## 🎨 Sistema de Design

### **Tokens de Design**
```tsx
// tailwind.config.js - Manter consistência
const designTokens = {
  colors: {
    primary: { 50: '#eff6ff', 500: '#3b82f6', 600: '#2563eb' },
    secondary: { 50: '#f8fafc', 500: '#64748b' }
  },
  spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
  borderRadius: { sm: '0.25rem', md: '0.5rem', lg: '1rem' }
};
```

### **Classes Utilitárias Customizadas**
```css
/* src/app/globals.css */
@layer components {
  .btn-base {
    @apply px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply btn-base bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
  }
  
  .card-base {
    @apply bg-white rounded-lg shadow-sm border border-gray-200;
  }
}
```

## 📊 Padrões de Dados

### **1. Estrutura de Artigo**
```tsx
// src/types/content.ts
export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  image?: ImageData;
  tags: string[];
  readTime: number;
  featured: boolean;
  seo: SEOData;
}
```

### **2. Gerenciamento de Estado**
```tsx
// Para dados simples: useState
// Para dados complexos: useReducer
// Para dados globais: Context API
// Para cache: SWR ou React Query

// Exemplo com SWR
import useSWR from 'swr';

function useArticles(category?: string) {
  const { data, error, isLoading } = useSWR(
    `/api/articles${category ? `?category=${category}` : ''}`,
    fetcher
  );
  
  return {
    articles: data,
    isLoading,
    isError: error
  };
}
```

## 🔍 SEO e Performance

### **Checklist de SEO por Página**
- [ ] Meta title único (50-60 caracteres)
- [ ] Meta description única (150-160 caracteres)
- [ ] Structured data (JSON-LD)
- [ ] Canonical URL
- [ ] Breadcrumbs
- [ ] Headings hierárquicos (H1 → H2 → H3)
- [ ] Alt text em imagens
- [ ] URLs amigáveis

### **Performance Guidelines**
```tsx
// ✅ BOM: Lazy loading de componentes
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// ✅ BOM: Otimização de imagens
import Image from 'next/image';
<Image src="/image.jpg" alt="Alt text" width={400} height={300} />

// ✅ BOM: Memoização quando necessário
const ExpensiveComponent = memo(({ data }) => {
  const processedData = useMemo(() => processData(data), [data]);
  return <div>{processedData}</div>;
});
```

## 🧪 Testes e Qualidade

### **Estrutura de Testes**
```
__tests__/
├── components/
│   ├── ui/
│   └── layout/
├── pages/
├── utils/
└── integration/
```

### **Padrão de Teste**
```tsx
// ComponentName.test.tsx
import { render, screen } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🚀 Deploy e Versionamento

### **Workflow de Deploy**
1. **Development**: `npm run dev`
2. **Build**: `npm run build`
3. **Test**: `npm run test`
4. **Lint**: `npm run lint`
5. **Deploy**: Push para main → Vercel auto-deploy

### **Versionamento Semântico**
- **MAJOR**: Mudanças que quebram compatibilidade
- **MINOR**: Novas funcionalidades compatíveis
- **PATCH**: Correções de bugs

## 📝 Documentação de Componentes

### **Template de Documentação**
```tsx
/**
 * CategoryCard - Exibe informações de uma categoria
 * 
 * @param category - Dados da categoria
 * @param size - Tamanho do card ('sm' | 'md' | 'lg')
 * @param showDescription - Se deve mostrar a descrição
 * @param onClick - Callback para clique no card
 * 
 * @example
 * <CategoryCard 
 *   category={categoryData} 
 *   size="md" 
 *   showDescription={true}
 *   onClick={() => router.push(`/${category.slug}`)}
 * />
 */
```

## ⚡ Otimizações Avançadas

### **Bundle Splitting**
```tsx
// Lazy loading por rota
const CategoryPage = lazy(() => import('./CategoryPage'));
const ArticlePage = lazy(() => import('./ArticlePage'));

// Code splitting por feature
const AdminPanel = lazy(() => import('./admin/AdminPanel'));
```

### **Caching Strategy**
```tsx
// ISR para conteúdo dinâmico
export const revalidate = 3600; // 1 hora

// Static para conteúdo estático
export async function generateStaticParams() {
  return categories.map(category => ({ slug: category.slug }));
}
```

---

**🎯 Lembre-se**: Mantenha sempre a consistência, priorize a reutilização e documente suas decisões. O código deve ser legível para o próximo desenvolvedor (que pode ser você mesmo em 6 meses).