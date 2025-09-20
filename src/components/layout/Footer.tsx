import Link from 'next/link';
import { categories } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold">HubAll</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Seu hub completo para conteúdos de qualidade. Notícias, currículos, saúde, 
              tecnologia, educação e utilidades em um só lugar.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              {categories.slice(0, 3).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Mais Categorias</h3>
            <ul className="space-y-2">
              {categories.slice(3).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 HubAll. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}