'use client';

import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = window.innerWidth < 640 ? 3 : 5;
    
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return (
    <nav className="flex justify-center mt-12 mb-8 px-4">
      <div className="flex items-center space-x-1 sm:space-x-2 flex-wrap justify-center gap-y-2">
        {/* Anterior */}
        {currentPage > 1 && (
          <Link
            href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
            className="px-2 sm:px-4 py-2 bg-newspaper-beige text-newspaper-ink border border-newspaper-brown hover:bg-newspaper-cream transition-colors font-serif font-semibold text-sm"
          >
            <span className="hidden sm:inline">← Anterior</span>
            <span className="sm:hidden">←</span>
          </Link>
        )}

        {/* Primeira página */}
        {getPageNumbers()[0] > 1 && (
          <>
            <Link
              href={basePath}
              className="px-2 sm:px-3 py-2 bg-newspaper-beige text-newspaper-ink border border-newspaper-brown hover:bg-newspaper-cream transition-colors font-serif text-sm"
            >
              1
            </Link>
            {getPageNumbers()[0] > 2 && (
              <span className="px-1 sm:px-2 text-newspaper-brown text-sm">...</span>
            )}
          </>
        )}

        {/* Páginas visíveis */}
        {getPageNumbers().map((page) => (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}?page=${page}`}
            className={`px-2 sm:px-3 py-2 border font-serif transition-colors text-sm ${
              page === currentPage
                ? 'bg-newspaper-brown text-newspaper-cream border-newspaper-brown'
                : 'bg-newspaper-beige text-newspaper-ink border-newspaper-brown hover:bg-newspaper-cream'
            }`}
          >
            {page}
          </Link>
        ))}

        {/* Última página */}
        {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
          <>
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
              <span className="px-1 sm:px-2 text-newspaper-brown text-sm">...</span>
            )}
            <Link
              href={`${basePath}?page=${totalPages}`}
              className="px-2 sm:px-3 py-2 bg-newspaper-beige text-newspaper-ink border border-newspaper-brown hover:bg-newspaper-cream transition-colors font-serif text-sm"
            >
              {totalPages}
            </Link>
          </>
        )}

        {/* Próxima */}
        {currentPage < totalPages && (
          <Link
            href={`${basePath}?page=${currentPage + 1}`}
            className="px-2 sm:px-4 py-2 bg-newspaper-beige text-newspaper-ink border border-newspaper-brown hover:bg-newspaper-cream transition-colors font-serif font-semibold text-sm"
          >
            <span className="hidden sm:inline">Próxima →</span>
            <span className="sm:hidden">→</span>
          </Link>
        )}
      </div>
    </nav>
  );
}