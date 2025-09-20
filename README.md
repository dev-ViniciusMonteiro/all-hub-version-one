# HubAll - Hub Universal de Conteúdos

## 🚀 Visão Geral

O HubAll é um hub universal de conteúdos desenvolvido com Next.js 14, focado em SEO, performance e escalabilidade. O projeto oferece conteúdos organizados em categorias como notícias, currículos, saúde, tecnologia, educação e utilidades.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   │   ├── sitemap/       # Sitemap dinâmico
│   │   └── robots/        # Robots.txt
│   ├── noticias/          # Categoria Notícias
│   ├── curriculo/         # Categoria Currículo
│   ├── saude/             # Categoria Saúde
│   ├── tecnologia/        # Categoria Tecnologia
│   ├── educacao/          # Categoria Educação
│   ├── utilidades/        # Categoria Utilidades
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Componentes de layout
│   ├── seo/               # Componentes SEO
│   └── ui/                # Componentes de interface
├── lib/
│   ├── seo/               # Utilitários SEO
│   └── utils/             # Utilitários gerais
├── types/                 # Definições TypeScript
└── data/                  # Dados estáticos
```

## 🎯 Características Principais

### SEO Otimizado
- ✅ Sitemap.xml dinâmico
- ✅ Robots.txt configurado
- ✅ Meta tags dinâmicas
- ✅ Schema.org (JSON-LD)
- ✅ Breadcrumbs estruturados
- ✅ URLs amigáveis
- ✅ Canonical tags

### Performance
- ✅ Next.js 14 com App Router
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ Otimização de imagens
- ✅ Core Web Vitals otimizados

### Escalabilidade
- ✅ Arquitetura modular
- ✅ TypeScript para type safety
- ✅ Componentes reutilizáveis
- ✅ Estrutura preparada para expansão

### Monetização
- ✅ Espaços para anúncios em páginas de conteúdo
- ✅ Home page limpa (sem anúncios)
- ✅ Ad placement otimizado para UX

## 🛠️ Tecnologias

- **Framework:** Next.js 14
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **SEO:** next-seo, structured data
- **Hospedagem:** Vercel (recomendado)

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

## 🎨 Customização

### Adicionar Nova Categoria

1. Adicione a categoria em `src/data/categories.ts`
2. Crie a pasta da categoria em `src/app/[categoria]/`
3. Implemente a página seguindo o padrão das existentes

### Configurar SEO

- Edite `src/lib/seo/index.ts` para personalizar meta tags
- Configure structured data específico por tipo de conteúdo
- Ajuste sitemap em `src/app/api/sitemap/route.ts`

### Personalizar Design

- Modifique cores em `tailwind.config.js`
- Ajuste componentes em `src/components/`
- Customize layout global em `src/app/layout.tsx`

## 🚀 Deploy na Vercel

1. Conecte o repositório à Vercel
2. Configure variáveis de ambiente se necessário
3. Deploy automático a cada push

## 📈 Próximos Passos

- [ ] Sistema de CMS para gerenciar conteúdo
- [ ] Implementar busca avançada
- [ ] Sistema de comentários
- [ ] Newsletter
- [ ] PWA (Progressive Web App)
- [ ] Múltiplos idiomas
- [ ] Analytics integrado

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.