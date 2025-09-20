'use client';

import Link from 'next/link';
import { useState } from 'react';
import { categories } from '@/data/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const mainCategories = categories.slice(0, 4);
  const moreCategories = categories.slice(4);

  return (
    <header className="bg-newspaper-cream border-b-4 border-newspaper-brown">
      {/* Cabeçalho Principal */}
      <div className="bg-newspaper-beige border-b border-newspaper-brown/20">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <Link href="/" className="inline-block">
            <h1 className="font-headline text-5xl md:text-6xl font-bold text-newspaper-ink tracking-tight">
              HubAll
            </h1>
            <p className="text-newspaper-brown text-sm font-serif italic mt-1">
              Seu Jornal Digital • Fundado em 2024
            </p>
          </Link>
          
          <div className="mt-4 text-xs text-newspaper-brown font-serif">
            {new Date().toLocaleDateString('pt-BR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }).toUpperCase()}
          </div>
        </div>
      </div>
      
      {/* Barra de Navegação */}
      <div className="bg-newspaper-brown">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="hidden lg:flex justify-center items-center py-3">
            {mainCategories.map((category, index) => (
              <div key={category.id} className="flex items-center">
                <Link
                  href={`/${category.slug}`}
                  className="text-newspaper-cream hover:text-primary-300 transition-colors font-serif font-semibold text-sm px-4 py-2 uppercase tracking-wide"
                >
                  {category.name}
                </Link>
                {index < mainCategories.length - 1 && (
                  <div className="w-px h-4 bg-newspaper-cream/30"></div>
                )}
              </div>
            ))}
            
            <div className="w-px h-4 bg-newspaper-cream/30 mx-2"></div>
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-newspaper-cream hover:text-primary-300 transition-colors font-serif font-semibold text-sm px-4 py-2 uppercase tracking-wide"
              >
                Mais Seções
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-newspaper-cream border-2 border-newspaper-brown shadow-lg z-50">
                  <div className="py-2">
                    {moreCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className="flex items-center px-4 py-2 text-sm text-newspaper-ink hover:bg-newspaper-beige font-serif"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-3 text-base">{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          <button 
            className="lg:hidden w-full py-3 text-newspaper-cream font-serif font-semibold text-sm uppercase tracking-wide"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰ Menu das Seções
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-newspaper-cream border-t-2 border-newspaper-brown">
            <div className="py-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex items-center px-6 py-3 text-newspaper-ink hover:bg-newspaper-beige font-serif border-b border-newspaper-brown/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-4 text-lg">{category.icon}</span>
                  <span className="font-semibold">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay para fechar dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}