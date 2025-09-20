const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
const { rewriteContent } = require('./ai-rewriter');
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

function extractTags(keywords) {
  if (!keywords) return ['política', 'notícias'];
  return keywords.split(',').map(tag => tag.trim()).slice(0, 5);
}

async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 8000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

async function scrapeG1() {
  try {
    const html = await fetchWithRetry('https://g1.globo.com/politica/');
    const $ = cheerio.load(html);
    const articles = [];

    $('.bastian-feed-item').slice(0, 4).each((i, element) => {
      const $el = $(element);
      const title = $el.find('a.feed-post-link').text().trim();
      const excerpt = $el.find('.feed-post-body-resumo').text().trim();
      const link = $el.find('a.feed-post-link').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link) {
        articles.push({
          title,
          originalTitle: title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://g1.globo.com${link}`,
          source: 'G1',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro G1:', error.message);
    return [];
  }
}

async function scrapeCNN() {
  try {
    const html = await fetchWithRetry('https://www.cnnbrasil.com.br/politica/');
    const $ = cheerio.load(html);
    const articles = [];

    $('article, .card, .news-item').slice(0, 4).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3').text().trim();
      const excerpt = $el.find('p').text().trim();
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link && title.length > 10) {
        articles.push({
          title,
          originalTitle: title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://www.cnnbrasil.com.br${link}`,
          source: 'CNN Brasil',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro CNN:', error.message);
    return [];
  }
}

async function scrapeJovemPan() {
  try {
    const html = await fetchWithRetry('https://jovempan.com.br/noticias/');
    const $ = cheerio.load(html);
    const articles = [];

    $('article, .post, .news-card, .card').slice(0, 4).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3').text().trim();
      const excerpt = $el.find('p').text().trim();
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link && title.length > 10) {
        articles.push({
          title,
          originalTitle: title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://jovempan.com.br${link}`,
          source: 'Jovem Pan',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro Jovem Pan:', error.message);
    return [];
  }
}

async function getFullContent(article) {
  try {
    console.log(`Buscando conteúdo de: ${article.title}`);
    const html = await fetchWithRetry(article.link);
    const $ = cheerio.load(html);
    
    let content = '';
    let author = article.source;
    let publishedAt = new Date().toISOString();
    
    if (article.source === 'G1') {
      // G1 - múltiplos seletores
      const paragraphs = $('.content-text__container p, .mc-body p, .content-text p').map((i, el) => $(el).text().trim()).get();
      content = paragraphs.join(' ');
      author = $('.content-publication-data__from, .author-name').text().trim().replace(/^(Por |Da |De )/i, '') || 'G1';
      publishedAt = $('time').attr('datetime') || new Date().toISOString();
    } else if (article.source === 'CNN Brasil') {
      // CNN Brasil - múltiplos seletores
      const paragraphs = $('.single-content p, .post-content p, .article-body p').map((i, el) => $(el).text().trim()).get();
      content = paragraphs.join(' ');
      author = $('.post-author, .article-author').text().trim().replace(/^(Por |Da |De )/i, '') || 'CNN Brasil';
      publishedAt = $('time').attr('datetime') || new Date().toISOString();
    } else if (article.source === 'Jovem Pan') {
      // Jovem Pan - seletores específicos e fallbacks
      let paragraphs = [];
      
      // Tenta diferentes seletores para o conteúdo
      const selectors = [
        '.post-content p',
        '.article-content p', 
        '.content p',
        '.entry-content p',
        '.post-body p',
        '.text-content p',
        'article p',
        '.main-content p'
      ];
      
      for (const selector of selectors) {
        paragraphs = $(selector).map((i, el) => $(el).text().trim()).get().filter(p => p.length > 20);
        if (paragraphs.length > 0) break;
      }
      
      // Se ainda não encontrou, pega todo texto de parágrafos
      if (paragraphs.length === 0) {
        paragraphs = $('p').map((i, el) => {
          const text = $(el).text().trim();
          return text.length > 30 ? text : null;
        }).get().filter(p => p);
      }
      
      content = paragraphs.slice(0, 10).join(' '); // Limita a 10 parágrafos
      
      author = $('.author-name, .post-author, .article-author').text().trim().replace(/^(Por |Da |De |Publicado por )/i, '') || 'Jovem Pan';
      publishedAt = $('time').attr('datetime') || $('.post-date').text().trim() || new Date().toISOString();
    }
    
    // Limpa o conteúdo e remove informações de autor que possam estar no texto
    content = content.replace(/\s+/g, ' ').trim();
    content = content.replace(/^(Por |Publicado por |Reportagem de |Da redação |\w+ \w+, \w+ — \w+)/i, '');
    content = content.replace(/(Publicada por .+|\*Reportagem produzida com auxílio de IA)$/i, '');
    
    return {
      ...article,
      content: content || article.excerpt,
      author,
      publishedAt,
      tags: ['política', 'brasil']
    };
  } catch (error) {
    console.error(`Erro ao buscar conteúdo de ${article.link}:`, error.message);
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ['política', 'brasil']
    };
  }
}

function transformToFormat(articles) {
  return articles.map(article => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const slug = createSlug(article.title);
    
    return {
      id,
      title: article.title,
      originalTitle: article.originalTitle,
      slug,
      excerpt: article.excerpt,
      content: `<p>${article.content}</p>`,
      image: article.image,
      category: "noticias",
      author: article.author,
      publishedAt: article.publishedAt,
      updatedAt: new Date().toISOString(),
      tags: article.tags,
      readTime: calculateReadTime(article.content),
      featured: false,
      views: 0,
      sourceUrl: article.link
    };
  });
}

async function updateNoticias() {
  try {
    console.log('🔄 Fazendo scraping das fontes de notícias...');
    
    const [g1Articles, cnnArticles, jpArticles] = await Promise.allSettled([
      scrapeG1(),
      scrapeCNN(),
      scrapeJovemPan()
    ]);
    
    // Log do status de cada fonte
    console.log('📊 Status das fontes:');
    console.log(`   G1 Política: ${g1Articles.status === 'fulfilled' ? '✅ OK (' + g1Articles.value.length + ' artigos)' : '❌ FALHOU - ' + g1Articles.reason?.message}`);
    console.log(`   CNN Brasil: ${cnnArticles.status === 'fulfilled' ? '✅ OK (' + cnnArticles.value.length + ' artigos)' : '❌ FALHOU - ' + cnnArticles.reason?.message}`);
    console.log(`   Jovem Pan: ${jpArticles.status === 'fulfilled' ? '✅ OK (' + jpArticles.value.length + ' artigos)' : '❌ FALHOU - ' + jpArticles.reason?.message}`);
    
    const allArticles = [
      ...(g1Articles.status === 'fulfilled' ? g1Articles.value : []),
      ...(cnnArticles.status === 'fulfilled' ? cnnArticles.value : []),
      ...(jpArticles.status === 'fulfilled' ? jpArticles.value : [])
    ];
    
    if (allArticles.length === 0) {
      console.log('⚠️ Nenhuma notícia encontrada');
      return;
    }
    
    console.log(`📰 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`);
    
    // Busca conteúdo completo de cada artigo
    const articlesWithContent = [];
    for (const article of allArticles) {
      const fullArticle = await getFullContent(article);
      console.log(`🤖 Reescrevendo: ${fullArticle.title.substring(0, 50)}...`);
      const rewritten = await rewriteContent(fullArticle.title, fullArticle.content);
      if (rewritten && rewritten.rewritten) {
        fullArticle.title = rewritten.title;
        fullArticle.content = rewritten.content;
        fullArticle.author = `Criado via IA em ${new Date().toLocaleDateString('pt-BR')}`;
        console.log('✅ Artigo reescrito com sucesso');
        articlesWithContent.push(fullArticle);
      } else {
        console.log('❌ IA falhou, pulando artigo');
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const formattedArticles = transformToFormat(articlesWithContent);
    
    const filePath = path.join(__dirname, '../src/data/json/noticias.json');
    let currentData = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      console.log('📄 Arquivo não existe, criando novo...');
    }
    
    // Remove duplicatas baseado no originalTitle
    const existingOriginalTitles = new Set(currentData.map(item => item.originalTitle?.toLowerCase() || item.title.toLowerCase()));
    const newArticles = formattedArticles.filter(article => 
      !existingOriginalTitles.has(article.originalTitle.toLowerCase())
    ).slice(0, 6);
    
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