import Link from 'next/link';
import { categories } from '@/data/categories';

export default function Footer() {
  return (
    <footer className="bg-newspaper-darkbrown text-newspaper-cream border-t-4 border-newspaper-brown">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="font-headline text-3xl font-bold text-newspaper-cream">HubAll</span>
            </Link>
            <p className="text-newspaper-cream/80 mb-4 font-serif leading-relaxed">
              Seu jornal digital completo. Notícias, esportes, tecnologia, saúde e muito mais 
              em um só lugar, com a tradição dos grandes jornais.
            </p>
          </div>
          
          <div>
            <h3 className="font-headline font-bold text-lg text-newspaper-cream mb-4 border-b border-newspaper-cream/30 pb-2">SEÇÕES PRINCIPAIS</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`}
                    className="text-newspaper-cream/70 hover:text-newspaper-cream transition-colors font-serif text-sm flex items-center"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-headline font-bold text-lg text-newspaper-cream mb-4 border-b border-newspaper-cream/30 pb-2">MAIS SEÇÕES</h3>
            <ul className="space-y-2">
              {categories.slice(5).map((category) => (
                <li key={category.id}>
                  <Link 
                    href={`/${category.slug}`}
                    className="text-newspaper-cream/70 hover:text-newspaper-cream transition-colors font-serif text-sm flex items-center"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-newspaper-cream/30 mt-8 pt-8 text-center">
          <p className="text-newspaper-cream/60 font-serif text-sm">
            &copy; 2024 HubAll - Jornal Digital. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}