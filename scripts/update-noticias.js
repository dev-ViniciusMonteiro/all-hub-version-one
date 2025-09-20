const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function calculateReadTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(' ').length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function extractTags(title, description) {
  const commonWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'das', 'dos', 'em', 'na', 'no', 'nas', 'nos', 'para', 'por', 'com', 'sem', 'sob', 'sobre', 'entre', 'até', 'desde', 'durante', 'após', 'antes', 'depois', 'contra', 'através', 'mediante', 'conforme', 'segundo', 'perante', 'salvo', 'exceto', 'menos', 'fora', 'além', 'aquém', 'dentro', 'fora', 'perto', 'longe', 'acima', 'abaixo', 'atrás', 'diante', 'frente', 'lado', 'meio', 'centro', 'fim', 'início', 'começo', 'final', 'primeiro', 'último', 'próximo', 'anterior', 'seguinte', 'passado', 'presente', 'futuro', 'hoje', 'ontem', 'amanhã', 'agora', 'então', 'assim', 'também', 'ainda', 'já', 'sempre', 'nunca', 'talvez', 'quase', 'muito', 'pouco', 'mais', 'menos', 'bem', 'mal', 'melhor', 'pior', 'maior', 'menor', 'grande', 'pequeno', 'novo', 'velho', 'jovem', 'idoso', 'bom', 'ruim', 'certo', 'errado', 'verdade', 'mentira', 'sim', 'não', 'que', 'qual', 'quais', 'quando', 'onde', 'como', 'por', 'porque', 'porquê', 'se', 'caso', 'embora', 'apesar', 'contudo', 'entretanto', 'todavia', 'porém', 'mas', 'e', 'ou', 'nem', 'seja', 'quer', 'tanto', 'quanto', 'logo', 'pois', 'portanto', 'assim', 'então', 'enfim', 'isto', 'isso', 'aquilo', 'este', 'esse', 'aquele', 'esta', 'essa', 'aquela', 'estes', 'esses', 'aqueles', 'estas', 'essas', 'aquelas', 'meu', 'minha', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'seu', 'sua', 'seus', 'suas', 'nosso', 'nossa', 'nossos', 'nossas', 'vosso', 'vossa', 'vossos', 'vossas', 'dele', 'dela', 'deles', 'delas', 'me', 'te', 'se', 'nos', 'vos', 'lhe', 'lhes', 'mim', 'ti', 'si', 'nós', 'vós', 'ele', 'ela', 'eles', 'elas', 'eu', 'tu', 'você', 'vocês', 'ninguém', 'alguém', 'algo', 'nada', 'tudo', 'cada', 'todo', 'toda', 'todos', 'todas', 'outro', 'outra', 'outros', 'outras', 'mesmo', 'mesma', 'mesmos', 'mesmas', 'próprio', 'própria', 'próprios', 'próprias', 'tal', 'tais', 'qualquer', 'quaisquer', 'certo', 'certa', 'certos', 'certas', 'vário', 'vária', 'vários', 'várias', 'diverso', 'diversa', 'diversos', 'diversas', 'diferente', 'diferentes', 'igual', 'iguais', 'semelhante', 'semelhantes', 'parecido', 'parecida', 'parecidos', 'parecidas', 'distinto', 'distinta', 'distintos', 'distintas', 'único', 'única', 'únicos', 'únicas', 'só', 'apenas', 'somente', 'unicamente', 'exclusivamente', 'principalmente', 'especialmente', 'particularmente', 'sobretudo', 'principalmente', 'basicamente', 'fundamentalmente', 'essencialmente', 'praticamente', 'teoricamente', 'tecnicamente', 'logicamente', 'obviamente', 'evidentemente', 'claramente', 'certamente', 'seguramente', 'definitivamente', 'absolutamente', 'completamente', 'totalmente', 'inteiramente', 'perfeitamente', 'exatamente', 'precisamente', 'rigorosamente', 'estritamente', 'literalmente', 'realmente', 'verdadeiramente', 'efetivamente', 'concretamente', 'objetivamente', 'subjetivamente', 'relativamente', 'comparativamente', 'proporcionalmente', 'aproximadamente', 'cerca', 'perto', 'longe', 'distante', 'próximo', 'vizinho', 'adjacente', 'contíguo', 'limítrofe', 'fronteiriço', 'marginal', 'periférico', 'central', 'nuclear', 'principal', 'secundário', 'auxiliar', 'complementar', 'suplementar', 'adicional', 'extra', 'excedente', 'sobressalente', 'reserva', 'substituto', 'alternativo', 'opcional', 'facultativo', 'obrigatório', 'necessário', 'indispensável', 'imprescindível', 'fundamental', 'básico', 'elementar', 'primário', 'inicial', 'original', 'primitivo', 'ancestral', 'antigo', 'arcaico', 'obsoleto', 'ultrapassado', 'desatualizado', 'moderno', 'contemporâneo', 'atual', 'presente', 'corrente', 'vigente', 'válido', 'ativo', 'ativo', 'passivo', 'inativo', 'inerte', 'estático', 'dinâmico', 'móvel', 'imóvel', 'fixo', 'estável', 'instável', 'variável', 'constante', 'permanente', 'temporário', 'provisório', 'definitivo', 'final', 'conclusivo', 'decisivo', 'determinante', 'crucial', 'crítico', 'vital', 'essencial', 'importante', 'relevante', 'significativo', 'considerável', 'notável', 'destacado', 'proeminente', 'saliente', 'evidente', 'óbvio', 'claro', 'nítido', 'distinto', 'preciso', 'exato', 'correto', 'adequado', 'apropriado', 'conveniente', 'oportuno', 'favorável', 'propício', 'benéfico', 'vantajoso', 'útil', 'proveitoso', 'lucrativo', 'rentável', 'produtivo', 'eficiente', 'eficaz', 'efetivo', 'válido', 'legítimo', 'legal', 'lícito', 'permitido', 'autorizado', 'aprovado', 'aceito', 'reconhecido', 'oficial', 'formal', 'informal', 'casual', 'espontâneo', 'natural', 'artificial', 'sintético', 'genuíno', 'autêntico', 'original', 'falso', 'fictício', 'imaginário', 'irreal', 'virtual', 'real', 'concreto', 'tangível', 'palpável', 'visível', 'invisível', 'aparente', 'oculto', 'escondido', 'secreto', 'confidencial', 'reservado', 'privado', 'público', 'aberto', 'fechado', 'livre', 'preso', 'solto', 'amarrado', 'ligado', 'conectado', 'desconectado', 'separado', 'unido', 'junto', 'próximo', 'distante', 'afastado', 'isolado', 'sozinho', 'acompanhado', 'coletivo', 'individual', 'pessoal', 'impessoal', 'íntimo', 'familiar', 'estranho', 'desconhecido', 'conhecido', 'reconhecido', 'famoso', 'célebre', 'ilustre', 'notório', 'renomado', 'prestigioso', 'respeitado', 'admirado', 'estimado', 'querido', 'amado', 'odiado', 'desprezado', 'rejeitado', 'aceito', 'bem-vindo', 'indesejado', 'desejado', 'procurado', 'buscado', 'encontrado', 'perdido', 'achado', 'descoberto', 'revelado', 'exposto', 'mostrado', 'exibido', 'apresentado', 'demonstrado', 'provado', 'comprovado', 'confirmado', 'verificado', 'checado', 'testado', 'experimentado', 'tentado', 'ensaiado', 'praticado', 'exercitado', 'treinado', 'preparado', 'pronto', 'acabado', 'terminado', 'finalizado', 'concluído', 'completado', 'realizado', 'executado', 'feito', 'criado', 'produzido', 'fabricado', 'construído', 'edificado', 'erguido', 'levantado', 'suspenso', 'pendurado', 'apoiado', 'sustentado', 'mantido', 'conservado', 'preservado', 'protegido', 'defendido', 'guardado', 'vigiado', 'observado', 'visto', 'olhado', 'contemplado', 'admirado', 'apreciado', 'valorizado', 'estimado', 'calculado', 'medido', 'pesado', 'contado', 'numerado', 'quantificado', 'qualificado', 'classificado', 'categorizado', 'organizado', 'arrumado', 'ordenado', 'estruturado', 'sistematizado', 'metodizado', 'planejado', 'programado', 'agendado', 'marcado', 'determinado', 'estabelecido', 'fixado', 'definido', 'especificado', 'detalhado', 'descrito', 'explicado', 'esclarecido', 'elucidado', 'ilustrado', 'exemplificado', 'demonstrado', 'mostrado', 'indicado', 'apontado', 'sinalizado', 'marcado', 'assinalado', 'destacado', 'sublinhado', 'enfatizado', 'ressaltado', 'salientado', 'frisado', 'acentuado', 'reforçado', 'intensificado', 'aumentado', 'ampliado', 'expandido', 'estendido', 'prolongado', 'alongado', 'esticado', 'puxado', 'arrastado', 'levado', 'conduzido', 'guiado', 'dirigido', 'orientado', 'encaminhado', 'enviado', 'mandado', 'despachado', 'remetido', 'entregue', 'dado', 'oferecido', 'presenteado', 'doado', 'cedido', 'emprestado', 'alugado', 'vendido', 'comprado', 'adquirido', 'obtido', 'conseguido', 'alcançado', 'atingido', 'chegado', 'partido', 'saído', 'ido', 'vindo', 'voltado', 'retornado', 'regressado', 'chegado', 'aparecido', 'surgido', 'emergido', 'brotado', 'nascido', 'crescido', 'desenvolvido', 'evoluído', 'progredido', 'avançado', 'melhorado', 'aperfeiçoado', 'refinado', 'polido', 'lapidado', 'trabalhado', 'elaborado', 'processado', 'tratado', 'cuidado', 'atendido', 'servido', 'ajudado', 'auxiliado', 'apoiado', 'assistido', 'socorrido', 'salvo', 'resgatado', 'libertado', 'solto', 'liberado', 'dispensado', 'demitido', 'despedido', 'contratado', 'empregado', 'usado', 'utilizado', 'empregado', 'aplicado', 'colocado', 'posto', 'situado', 'localizado', 'posicionado', 'instalado', 'montado', 'armado', 'construído', 'edificado', 'erguido', 'levantado', 'suspenso', 'pendurado', 'apoiado', 'sustentado', 'mantido', 'conservado', 'preservado', 'protegido', 'defendido', 'guardado', 'vigiado', 'observado', 'visto', 'olhado', 'contemplado', 'admirado', 'apreciado', 'valorizado', 'estimado', 'calculado', 'medido', 'pesado', 'contado', 'numerado', 'quantificado', 'qualificado', 'classificado', 'categorizado', 'organizado', 'arrumado', 'ordenado', 'estruturado', 'sistematizado', 'metodizado', 'planejado', 'programado', 'agendado', 'marcado', 'determinado', 'estabelecido', 'fixado', 'definido', 'especificado', 'detalhado', 'descrito', 'explicado', 'esclarecido', 'elucidado', 'ilustrado', 'exemplificado', 'demonstrado', 'mostrado', 'indicado', 'apontado', 'sinalizado', 'marcado', 'assinalado', 'destacado', 'sublinhado', 'enfatizado', 'ressaltado', 'salientado', 'frisado', 'acentuado', 'reforçado', 'intensificado', 'aumentado', 'ampliado', 'expandido', 'estendido', 'prolongado', 'alongado', 'esticado', 'puxado', 'arrastado', 'levado', 'conduzido', 'guiado', 'dirigido', 'orientado', 'encaminhado', 'enviado', 'mandado', 'despachado', 'remetido', 'entregue', 'dado', 'oferecido', 'presenteado', 'doado', 'cedido', 'emprestado', 'alugado', 'vendido', 'comprado', 'adquirido', 'obtido', 'conseguido', 'alcançado', 'atingido', 'chegado', 'partido', 'saído', 'ido', 'vindo', 'voltado', 'retornado', 'regressado', 'chegado', 'aparecido', 'surgido', 'emergido', 'brotado', 'nascido', 'crescido', 'desenvolvido', 'evoluído', 'progredido', 'avançado', 'melhorado', 'aperfeiçoado', 'refinado', 'polido', 'lapidado', 'trabalhado', 'elaborado', 'processado', 'tratado', 'cuidado', 'atendido', 'servido', 'ajudado', 'auxiliado', 'apoiado', 'assistido', 'socorrido', 'salvo', 'resgatado', 'libertado', 'solto', 'liberado', 'dispensado', 'demitido', 'despedido', 'contratado', 'empregado', 'usado', 'utilizado', 'empregado', 'aplicado', 'colocado', 'posto', 'situado', 'localizado', 'posicionado', 'instalado', 'montado', 'armado'];
  
  const text = `${title} ${description}`.toLowerCase();
  const words = text.match(/\b\w{4,}\b/g) || [];
  
  return words
    .filter(word => !commonWords.includes(word))
    .slice(0, 5);
}

function isValidImageUrl(url) {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

async function fetchNewsFromAPI() {
  const today = new Date();
  const twoDaysAgo = new Date(today.getTime() - (2 * 24 * 60 * 60 * 1000));
  
  const fromDate = twoDaysAgo.toISOString().split('T')[0];
  const toDate = today.toISOString().split('T')[0];
  
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    throw new Error('NEWS_API_KEY não encontrada no .env');
  }
  
  const url = `https://newsapi.org/v2/everything?q=brasil&from=${fromDate}&to=${toDate}&language=pt&apiKey=${apiKey}&pageSize=20&sortBy=publishedAt`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

function transformNewsToFormat(articles) {
  return articles
    .filter(article => article.title && article.description && article.url)
    .map(article => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const slug = createSlug(article.title);
      
      // Usa a descrição que geralmente é mais completa
      let fullContent = article.description;
      
      // Se houver conteúdo adicional, usa ele também
      if (article.content && article.content !== article.description) {
        const cleanContent = article.content.replace(/\[\+\d+ chars\].*$/, '').replace(/…$/, '').trim();
        if (cleanContent.length > fullContent.length) {
          fullContent = cleanContent;
        }
      }
      
      const content = `<p>${fullContent}</p>`;
      
      // Valida e trata a imagem
      let imageUrl = null;
      if (article.urlToImage && isValidImageUrl(article.urlToImage)) {
        imageUrl = article.urlToImage;
      }
      
      return {
        id,
        title: article.title,
        slug,
        excerpt: fullContent,
        content,
        image: imageUrl,
        category: "noticias",
        author: article.author || article.source.name || "Redação",
        publishedAt: article.publishedAt,
        updatedAt: new Date().toISOString(),
        tags: extractTags(article.title, article.description),
        readTime: calculateReadTime(content),
        featured: false,
        views: 0,
        sourceUrl: article.url
      };
    });
}

async function updateNoticias() {
  try {
    console.log('🔄 Buscando notícias da NewsAPI...');
    
    const newsData = await fetchNewsFromAPI();
    
    if (!newsData.articles || newsData.articles.length === 0) {
      console.log('⚠️ Nenhuma notícia encontrada');
      return;
    }
    
    const novasNoticias = transformNewsToFormat(newsData.articles);
    
    const filePath = path.join(__dirname, '../src/data/json/noticias.json');
    let currentData = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      console.log('📄 Arquivo não existe, criando novo...');
    }
    
    // Remove duplicatas baseado no título e slug
    const existingTitles = new Set(currentData.map(item => item.title.toLowerCase()));
    const existingSlugs = new Set(currentData.map(item => item.slug));
    
    const newArticles = novasNoticias.filter(article => 
      !existingSlugs.has(article.slug) && 
      !existingTitles.has(article.title.toLowerCase())
    ).slice(0, 10); // Máximo 10 notícias novas
    
    if (newArticles.length === 0) {
      console.log('ℹ️ Nenhuma notícia nova encontrada');
      return;
    }
    
    // Adiciona novas notícias no início
    currentData = [...newArticles, ...currentData];
    
    // Mantém apenas os 50 mais recentes
    currentData = currentData.slice(0, 50);
    
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    
    console.log(`✅ ${newArticles.length} novas notícias adicionadas`);
    console.log(`📊 Total de notícias: ${currentData.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar notícias:', error.message);
    process.exit(1);
  }
}

updateNoticias();