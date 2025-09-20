export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

export interface Article {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image?: string | null;
  tags: string[];
  readTime: number;
  featured: boolean;
  views?: number;
  sourceUrl?: string;
}

export interface Content {
  id: string;
  title: string;
  originalTitle?: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  updatedAt: string;
  image?: string | null;
  tags: string[];
  readTime: number;
  featured: boolean;
  views?: number;
  sourceUrl?: string;
}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: any;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}