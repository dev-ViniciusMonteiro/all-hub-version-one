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

async function scrapeGEFutebol() {
  try {
    const html = await fetchWithRetry('https://ge.globo.com/futebol/');
    const $ = cheerio.load(html);
    const articles = [];

    $('.bastian-feed-item, .feed-post').slice(0, 2).each((i, element) => {
      const $el = $(element);
      const title = $el.find('a.feed-post-link, h2 a, h3 a').text().trim();
      const excerpt = $el.find('.feed-post-body-resumo, p').text().trim();
      const link = $el.find('a.feed-post-link, h2 a, h3 a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://ge.globo.com${link}`,
          source: 'GE Futebol',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro GE Futebol:', error.message);
    return [];
  }
}

async function scrapeUOLEsportes() {
  try {
    const html = await fetchWithRetry('https://www.uol.com.br/esporte/');
    const $ = cheerio.load(html);
    const articles = [];

    $('article, .news-item, .card').slice(0, 2).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3').text().trim();
      const excerpt = $el.find('p').text().trim();
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link && title.length > 10) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://www.uol.com.br${link}`,
          source: 'UOL Esportes',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro UOL Esportes:', error.message);
    return [];
  }
}

async function scrapeTerraEsportes() {
  try {
    const html = await fetchWithRetry('https://www.terra.com.br/esportes/');
    const $ = cheerio.load(html);
    const articles = [];

    $('article, .news-item, .card').slice(0, 2).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3').text().trim();
      const excerpt = $el.find('p').text().trim();
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link && title.length > 10) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://www.terra.com.br${link}`,
          source: 'Terra Esportes',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro Terra Esportes:', error.message);
    return [];
  }
}

async function getFullContent(article) {
  try {
    const html = await fetchWithRetry(article.link);
    const $ = cheerio.load(html);
    
    let content = '';
    let author = article.source;
    let publishedAt = new Date().toISOString();
    
    // Seletores genéricos para conteúdo
    const selectors = [
      '.content-text__container p',
      '.mc-body p',
      '.post-content p',
      '.article-content p',
      '.content p',
      '.entry-content p',
      'article p'
    ];
    
    for (const selector of selectors) {
      const paragraphs = $(selector).map((i, el) => $(el).text().trim()).get().filter(p => p.length > 20);
      if (paragraphs.length > 0) {
        content = paragraphs.slice(0, 8).join(' ');
        break;
      }
    }
    
    author = $('.author-name, .post-author, .article-author').text().trim() || article.source;
    publishedAt = $('time').attr('datetime') || new Date().toISOString();
    
    return {
      ...article,
      content: content || article.excerpt,
      author,
      publishedAt,
      tags: ['esportes', 'brasil']
    };
  } catch (error) {
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ['esportes', 'brasil']
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
      slug,
      excerpt: article.excerpt,
      content: `<p>${article.content}</p>`,
      image: article.image,
      category: "esportes",
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

async function updateEsportes() {
  try {
    console.log('🔄 Fazendo scraping de esportes...');
    
    const [geArticles, uolArticles, terraArticles] = await Promise.allSettled([
      scrapeGEFutebol(),
      scrapeUOLEsportes(),
      scrapeTerraEsportes()
    ]);
    
    // Log do status de cada fonte
    console.log('📊 Status das fontes:');
    console.log(`   GE Futebol: ${geArticles.status === 'fulfilled' ? '✅ OK (' + geArticles.value.length + ' artigos)' : '❌ FALHOU - ' + geArticles.reason?.message}`);
    console.log(`   UOL Esportes: ${uolArticles.status === 'fulfilled' ? '✅ OK (' + uolArticles.value.length + ' artigos)' : '❌ FALHOU - ' + uolArticles.reason?.message}`);
    console.log(`   Terra Esportes: ${terraArticles.status === 'fulfilled' ? '✅ OK (' + terraArticles.value.length + ' artigos)' : '❌ FALHOU - ' + terraArticles.reason?.message}`);
    
    const allArticles = [
      ...(geArticles.status === 'fulfilled' ? geArticles.value : []),
      ...(uolArticles.status === 'fulfilled' ? uolArticles.value : []),
      ...(terraArticles.status === 'fulfilled' ? terraArticles.value : [])
    ];
    
    if (allArticles.length === 0) {
      console.log('⚠️ Nenhuma notícia de esportes encontrada');
      return;
    }
    
    console.log(`🏆 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`);
    
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
      } else {
        fullArticle.author = `Criado via IA em ${new Date().toLocaleDateString('pt-BR')}`;
        console.log('⚠️ IA falhou, usando conteúdo original');
      }
      articlesWithContent.push(fullArticle);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const formattedArticles = transformToFormat(articlesWithContent);
    
    const filePath = path.join(__dirname, '../src/data/json/esportes.json');
    let currentData = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      console.log('📄 Arquivo não existe, criando novo...');
    }
    
    const existingTitles = new Set(currentData.map(item => item.title.toLowerCase()));
    const newArticles = formattedArticles.filter(article => 
      !existingTitles.has(article.title.toLowerCase())
    ).slice(0, 6);
    
    if (newArticles.length === 0) {
      console.log('ℹ️ Nenhuma notícia nova de esportes encontrada');
      return;
    }
    
    currentData = [...newArticles, ...currentData];
    currentData = currentData.slice(0, 50);
    
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    
    console.log(`✅ ${newArticles.length} novas notícias de esportes adicionadas`);
    console.log(`📊 Total de esportes: ${currentData.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar esportes:', error.message);
    process.exit(1);
  }
}

updateEsportes();