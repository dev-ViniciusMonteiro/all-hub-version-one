# Padrões de Componentes - HubAll

## 🧩 Componentes Reutilizáveis Essenciais

### **1. CategoryCard - Componente Base**
```tsx
// src/components/content/CategoryCard.tsx
import Link from 'next/link';
import { Category } from '@/types';
import { clsx } from 'clsx';

interface CategoryCardProps {
  category: Category;
  size?: 'sm' | 'md' | 'lg';
  showDescription?: boolean;
  className?: string;
}

export default function CategoryCard({
  category,
  size = 'md',
  showDescription = true,
  className
}: CategoryCardProps) {
  return (
    <Link
      href={`/${category.slug}`}
      className={clsx(
        'card hover:shadow-lg transition-all duration-300 group',
        {
          'p-4': size === 'sm',
          'p-6': size === 'md',
          'p-8': size === 'lg',
        },
        className
      )}
    >
      <div className="text-center">
        <div className={clsx(
          category.color,
          'rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform',
          {
            'w-12 h-12': size === 'sm',
            'w-16 h-16': size === 'md',
            'w-20 h-20': size === 'lg',
          }
        )}>
          <span className={clsx(
            {
              'text-lg': size === 'sm',
              'text-2xl': size === 'md',
              'text-3xl': size === 'lg',
            }
          )}>
            {category.icon}
          </span>
        </div>
        <h3 className={clsx(
          'font-semibold text-gray-900 mb-2',
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg',
          }
        )}>
          {category.name}
        </h3>
        {showDescription && (
          <p className="text-gray-600 leading-relaxed">
            {category.description}
          </p>
        )}
      </div>
    </Link>
  );
}
```

### **2. ArticleCard - Componente de Artigo**
```tsx
// src/components/content/ArticleCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  showImage?: boolean;
  showExcerpt?: boolean;
}

export default function ArticleCard({
  article,
  variant = 'default',
  showImage = true,
  showExcerpt = true
}: ArticleCardProps) {
  const isCompact = variant === 'compact';
  const isFeatured = variant === 'featured';

  return (
    <article className={clsx(
      'card overflow-hidden',
      {
        'hover:shadow-lg transition-shadow': !isCompact,
        'border-2 border-primary-200': isFeatured,
      }
    )}>
      {showImage && article.image && (
        <div className={clsx(
          'relative overflow-hidden',
          {
            'h-48': variant === 'default',
            'h-64': isFeatured,
            'h-32': isCompact,
          }
        )}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className={clsx(
        {
          'p-6': variant === 'default',
          'p-8': isFeatured,
          'p-4': isCompact,
        }
      )}>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <time dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
          <span className="mx-2">•</span>
          <span>{article.readTime} min de leitura</span>
        </div>
        
        <h3 className={clsx(
          'font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors',
          {
            'text-xl': variant === 'default',
            'text-2xl': isFeatured,
            'text-lg': isCompact,
          }
        )}>
          <Link href={`/${article.category}/${article.slug}`}>
            {article.title}
          </Link>
        </h3>
        
        {showExcerpt && !isCompact && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {article.excerpt}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {!isCompact && (
            <Link
              href={`/${article.category}/${article.slug}`}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Ler mais →
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
```

### **3. AdSpace - Componente de Anúncios**
```tsx
// src/components/ads/AdSpace.tsx
import { clsx } from 'clsx';

interface AdSpaceProps {
  size: '728x90' | '300x250' | '320x50' | '160x600';
  className?: string;
  label?: string;
}

const adSizes = {
  '728x90': 'w-[728px] h-[90px]',
  '300x250': 'w-[300px] h-[250px]',
  '320x50': 'w-[320px] h-[50px]',
  '160x600': 'w-[160px] h-[600px]',
};

export default function AdSpace({ size, className, label }: AdSpaceProps) {
  return (
    <div className={clsx(
      'bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center',
      adSizes[size],
      className
    )}>
      <p className="text-gray-500 text-sm">
        {label || `Anúncio (${size})`}
      </p>
    </div>
  );
}
```

### **4. PageLayout - Layout Reutilizável**
```tsx
// src/components/layout/PageLayout.tsx
import { ReactNode } from 'react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import AdSpace from '@/components/ads/AdSpace';
import { BreadcrumbItem } from '@/types';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  showAds?: boolean;
  sidebar?: ReactNode;
}

export default function PageLayout({
  children,
  title,
  description,
  breadcrumbs,
  showAds = true,
  sidebar
}: PageLayoutProps) {
  return (
    <div className="container-main py-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        {description && (
          <p className="text-lg text-gray-600 max-w-3xl">{description}</p>
        )}
      </div>

      {showAds && (
        <div className="mb-8 flex justify-center">
          <AdSpace size="728x90" />
        </div>
      )}

      <div className={clsx(
        'grid gap-8',
        sidebar ? 'lg:grid-cols-3' : 'grid-cols-1'
      )}>
        <div className={sidebar ? 'lg:col-span-2' : 'col-span-1'}>
          {children}
        </div>
        
        {sidebar && (
          <aside className="space-y-6">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
```

## 🔄 Hooks Customizados

### **1. useCategory - Hook para Categorias**
```tsx
// src/hooks/useCategory.ts
import { categories } from '@/data/categories';
import { Category } from '@/types';

export function useCategory(slug: string): Category | null {
  return categories.find(category => category.slug === slug) || null;
}

export function useCategories(): Category[] {
  return categories;
}
```

### **2. useSEO - Hook para SEO**
```tsx
// src/hooks/useSEO.ts
import { usePathname } from 'next/navigation';
import { generateBreadcrumbs, generateSEO } from '@/lib/seo';
import { Category, Article } from '@/types';

export function useSEO(data?: { category?: Category; article?: Article }) {
  const pathname = usePathname();
  
  const breadcrumbs = generateBreadcrumbs(pathname);
  
  const seo = data?.article 
    ? generateSEO.article(data.article)
    : data?.category 
    ? generateSEO.category(data.category)
    : generateSEO.home();
    
  return { breadcrumbs, seo };
}
```

## 📋 Templates de Página

### **1. Template de Categoria**
```tsx
// src/templates/CategoryTemplate.tsx
import { Category, Article } from '@/types';
import PageLayout from '@/components/layout/PageLayout';
import ArticleCard from '@/components/content/ArticleCard';
import CategorySidebar from '@/components/content/CategorySidebar';
import { useSEO } from '@/hooks/useSEO';

interface CategoryTemplateProps {
  category: Category;
  articles: Article[];
  featuredArticles: Article[];
}

export default function CategoryTemplate({
  category,
  articles,
  featuredArticles
}: CategoryTemplateProps) {
  const { breadcrumbs } = useSEO({ category });

  return (
    <PageLayout
      title={category.name}
      description={category.description}
      breadcrumbs={breadcrumbs}
      sidebar={<CategorySidebar category={category} articles={featuredArticles} />}
    >
      <div className="space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            variant="default"
          />
        ))}
      </div>
    </PageLayout>
  );
}
```

### **2. Template de Artigo**
```tsx
// src/templates/ArticleTemplate.tsx
import { Article } from '@/types';
import PageLayout from '@/components/layout/PageLayout';
import ArticleContent from '@/components/content/ArticleContent';
import ArticleSidebar from '@/components/content/ArticleSidebar';
import { useSEO } from '@/hooks/useSEO';

interface ArticleTemplateProps {
  article: Article;
  relatedArticles: Article[];
}

export default function ArticleTemplate({
  article,
  relatedArticles
}: ArticleTemplateProps) {
  const { breadcrumbs } = useSEO({ article });

  return (
    <PageLayout
      title={article.title}
      breadcrumbs={breadcrumbs}
      sidebar={<ArticleSidebar article={article} relatedArticles={relatedArticles} />}
    >
      <ArticleContent article={article} />
    </PageLayout>
  );
}
```

## 🎨 Sistema de Variantes

### **Padrão de Variantes com CVA (Class Variance Authority)**
```tsx
// src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2',
        lg: 'px-6 py-3 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

export default function Button({
  children,
  variant,
  size,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}
```

## 🔧 Utilitários de Desenvolvimento

### **1. Gerador de Componentes**
```bash
# scripts/create-component.js
const fs = require('fs');
const path = require('path');

const componentTemplate = (name) => `
import { ReactNode } from 'react';
import { clsx } from 'clsx';

interface ${name}Props {
  children?: ReactNode;
  className?: string;
}

export default function ${name}({ children, className }: ${name}Props) {
  return (
    <div className={clsx('', className)}>
      {children}
    </div>
  );
}
`;

// Usage: node scripts/create-component.js ComponentName ui
```

### **2. Validador de Props**
```tsx
// src/lib/prop-validator.ts
import { z } from 'zod';

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  icon: z.string(),
  color: z.string().startsWith('bg-'),
});

export const ArticleSchema = z.object({
  id: z.string(),
  title: z.string().min(10).max(100),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  excerpt: z.string().min(50).max(200),
  content: z.string().min(100),
  category: z.string(),
  tags: z.array(z.string()).min(1).max(10),
  readTime: z.number().min(1).max(60),
});
```

## 📊 Métricas de Qualidade

### **Checklist de Componente**
- [ ] **Props tipadas** com TypeScript
- [ ] **Variantes** implementadas (size, variant, state)
- [ ] **Acessibilidade** (ARIA labels, keyboard navigation)
- [ ] **Responsividade** (mobile-first)
- [ ] **Performance** (memo quando necessário)
- [ ] **Testes** unitários
- [ ] **Documentação** JSDoc
- [ ] **Storybook** stories (opcional)

### **Padrões de Qualidade**
```tsx
// ✅ BOM: Props bem definidas
interface ComponentProps {
  required: string;
  optional?: boolean;
  variant?: 'primary' | 'secondary';
}

// ✅ BOM: Valores padrão
const { variant = 'primary', optional = false } = props;

// ✅ BOM: Composição sobre herança
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
  </CardHeader>
  <CardContent>{content}</CardContent>
</Card>

// ❌ RUIM: Props genéricas demais
interface BadProps {
  data: any;
  config: object;
}
```

---

**💡 Dica**: Use este guia como referência para manter consistência e qualidade em todos os componentes do projeto. Cada novo componente deve seguir estes padrões estabelecidos.