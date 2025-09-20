const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');
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
  if (!keywords) return [];
  return keywords.split(',').map(tag => tag.trim()).slice(0, 5);
}

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
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

    $('.bastian-feed-item').slice(0, 5).each((i, element) => {
      const $el = $(element);
      const title = $el.find('a.feed-post-link').text().trim();
      const excerpt = $el.find('.feed-post-body-resumo').text().trim();
      const link = $el.find('a.feed-post-link').attr('href');
      
      if (title && link) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://g1.globo.com${link}`,
          source: 'G1'
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro ao fazer scraping do G1:', error.message);
    return [];
  }
}

async function scrapeCNN() {
  try {
    const html = await fetchWithRetry('https://www.cnnbrasil.com.br/politica/');
    const $ = cheerio.load(html);
    const articles = [];

    $('.card__container').slice(0, 5).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h2.card__title a').text().trim();
      const excerpt = $el.find('p.card__description').text().trim();
      const link = $el.find('h2.card__title a').attr('href');
      
      if (title && link) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://www.cnnbrasil.com.br${link}`,
          source: 'CNN Brasil'
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro ao fazer scraping da CNN:', error.message);
    return [];
  }
}

async function scrapeJovemPan() {
  try {
    const html = await fetchWithRetry('https://jovempan.com.br/noticias/politica');
    const $ = cheerio.load(html);
    const articles = [];

    $('.list-item').slice(0, 5).each((i, element) => {
      const $el = $(element);
      const title = $el.find('a.list-item-title').text().trim();
      const excerpt = $el.find('p.list-item-description').text().trim();
      const link = $el.find('a.list-item-title').attr('href');
      
      if (title && link) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://jovempan.com.br${link}`,
          source: 'Jovem Pan'
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro ao fazer scraping da Jovem Pan:', error.message);
    return [];
  }
}

async function getArticleContent(article) {
  try {
    const html = await fetchWithRetry(article.link);
    const $ = cheerio.load(html);
    
    let content = '';
    let author = '';
    let publishedAt = '';
    let tags = [];
    let image = '';

    // G1
    if (article.source === 'G1') {
      content = $('.mc-body').text().trim();
      author = $('.author-name').text().trim() || 'G1';
      publishedAt = $('time').attr('datetime') || new Date().toISOString();
      const keywords = $('meta[name="keywords"]').attr('content');
      tags = extractTags(keywords);
      image = $('.mc-body img').first().attr('src') || '';
    }
    // CNN Brasil
    else if (article.source === 'CNN Brasil') {
      content = $('.article__body').text().trim();
      author = $('.article__author').text().trim() || 'CNN Brasil';
      publishedAt = $('.article__date').attr('datetime') || new Date().toISOString();
      const keywords = $('meta[name="keywords"]').attr('content');
      tags = extractTags(keywords);
      image = $('.article__figure img').first().attr('src') || '';
    }
    // Jovem Pan
    else if (article.source === 'Jovem Pan') {
      content = $('.article-content').text().trim();
      author = $('.article-author').text().trim() || 'Jovem Pan';
      publishedAt = $('time').attr('datetime') || new Date().toISOString();
      const keywords = $('meta[name="keywords"]').attr('content');
      tags = extractTags(keywords);
      image = $('.article-content img').first().attr('src') || '';
    }

    return {
      ...article,
      content: content || article.excerpt,
      author,
      publishedAt,
      tags: tags.length > 0 ? tags : ['política', 'notícias'],
      image
    };
  } catch (error) {
    console.error(`Erro ao buscar conteúdo de ${article.link}:`, error.message);
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ['política', 'notícias'],
      image: ''
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
      image: article.image || null,
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
    
    // Busca artigos das 3 fontes
    const [g1Articles, cnnArticles, jpArticles] = await Promise.all([
      scrapeG1(),
      scrapeCNN(),
      scrapeJovemPan()
    ]);
    
    const allArticles = [...g1Articles, ...cnnArticles, ...jpArticles];
    
    if (allArticles.length === 0) {
      console.log('⚠️ Nenhuma notícia encontrada');
      return;
    }
    
    console.log(`📰 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`);
    
    // Busca conteúdo completo de cada artigo
    const articlesWithContent = [];
    for (const article of allArticles.slice(0, 10)) {
      const fullArticle = await getArticleContent(article);
      articlesWithContent.push(fullArticle);
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay entre requests
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
    
    // Remove duplicatas baseado no título
    const existingTitles = new Set(currentData.map(item => item.title.toLowerCase()));
    const newArticles = formattedArticles.filter(article => 
      !existingTitles.has(article.title.toLowerCase())
    );
    
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