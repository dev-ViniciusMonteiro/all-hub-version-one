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
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HubAll</span>
          </Link>
          
          <nav className="hidden lg:flex items-center space-x-6">
            {mainCategories.map((category) => (
              <Link
                key={category.id}
                href={`/${category.slug}`}
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
              >
                {category.name}
              </Link>
            ))}
            
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-gray-700 hover:text-primary-600 transition-colors font-medium text-sm"
              >
                Mais
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50">
                  <div className="py-1">
                    {moreCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/${category.slug}`}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
          
          <button 
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Menu</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t">
            <div className="py-2 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mr-3">{category.icon}</span>
                  {category.name}
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