import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'HubAll - Hub Universal de Conteúdos',
    template: '%s | HubAll'
  },
  description: 'Seu hub completo para notícias, currículos, saúde, tecnologia, educação e utilidades. Conteúdo de qualidade em um só lugar.',
  keywords: ['hub', 'conteúdo', 'notícias', 'currículo', 'saúde', 'tecnologia', 'educação', 'utilidades'],
  authors: [{ name: 'HubAll Team' }],
  creator: 'HubAll',
  publisher: 'HubAll',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://huball.com.br',
    siteName: 'HubAll',
    title: 'HubAll - Hub Universal de Conteúdos',
    description: 'Seu hub completo para conteúdos de qualidade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HubAll - Hub Universal de Conteúdos',
    description: 'Seu hub completo para conteúdos de qualidade',
  },
  verification: {
    google: 'google-site-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}