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

async function scrapeG1Tecnologia() {
  try {
    const html = await fetchWithRetry('https://g1.globo.com/tecnologia/');
    const $ = cheerio.load(html);
    const articles = [];

    $('.bastian-feed-item').slice(0, 2).each((i, element) => {
      const $el = $(element);
      const title = $el.find('a.feed-post-link').text().trim();
      const excerpt = $el.find('.feed-post-body-resumo').text().trim();
      const link = $el.find('a.feed-post-link').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://g1.globo.com${link}`,
          source: 'G1 Tecnologia',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro G1 Tecnologia:', error.message);
    return [];
  }
}

async function scrapeUOLTecnologia() {
  try {
    const html = await fetchWithRetry('https://tecnologia.uol.com.br/');
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
          link: link.startsWith('http') ? link : `https://tecnologia.uol.com.br${link}`,
          source: 'UOL Tecnologia',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro UOL Tecnologia:', error.message);
    return [];
  }
}

async function scrapeCanaltech() {
  try {
    const html = await fetchWithRetry('https://canaltech.com.br/');
    const $ = cheerio.load(html);
    const articles = [];

    $('.post-item, .news-card, article').slice(0, 2).each((i, element) => {
      const $el = $(element);
      const title = $el.find('h1, h2, h3, .title').text().trim();
      const excerpt = $el.find('p, .excerpt, .description').text().trim();
      const link = $el.find('a').attr('href');
      const image = $el.find('img').attr('src') || $el.find('img').attr('data-src');
      
      if (title && link && title.length > 10) {
        articles.push({
          title,
          excerpt: excerpt || title,
          link: link.startsWith('http') ? link : `https://canaltech.com.br${link}`,
          source: 'Canaltech',
          image: image || null
        });
      }
    });

    return articles;
  } catch (error) {
    console.error('Erro Canaltech:', error.message);
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
    
    const selectors = [
      '.content-text__container p',
      '.mc-body p',
      '.post-content p',
      '.article-content p',
      '.content p',
      '.entry-content p',
      '.post-body p',
      '.article-body p',
      'article p',
      '.text p'
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
      tags: ['tecnologia', 'inovação']
    };
  } catch (error) {
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ['tecnologia', 'inovação']
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
      category: "tecnologia",
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

async function updateTecnologia() {
  try {
    console.log('🔄 Fazendo scraping de tecnologia...');
    
    const [g1Articles, uolArticles, canaltechArticles] = await Promise.allSettled([
      scrapeG1Tecnologia(),
      scrapeUOLTecnologia(),
      scrapeCanaltech()
    ]);
    
    const allArticles = [
      ...(g1Articles.status === 'fulfilled' ? g1Articles.value : []),
      ...(uolArticles.status === 'fulfilled' ? uolArticles.value : []),
      ...(canaltechArticles.status === 'fulfilled' ? canaltechArticles.value : [])
    ];
    
    if (allArticles.length === 0) {
      console.log('⚠️ Nenhuma notícia de tecnologia encontrada');
      return;
    }
    
    console.log(`💻 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`);
    
    const articlesWithContent = [];
    for (const article of allArticles) {
      const fullArticle = await getFullContent(article);
      console.log(`🤖 Reescrevendo: ${fullArticle.title.substring(0, 50)}...`);
      const rewritten = await rewriteContent(fullArticle.title, fullArticle.content);
      if (rewritten && rewritten.rewritten) {
        fullArticle.title = rewritten.title;
        fullArticle.content = rewritten.content;
        fullArticle.excerpt = rewritten.excerpt || '';
        fullArticle.author = `Criado via IA em ${new Date().toLocaleDateString('pt-BR')}`;
        articlesWithContent.push(fullArticle);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    const formattedArticles = transformToFormat(articlesWithContent);
    
    const filePath = path.join(__dirname, '../src/data/json/tecnologia.json');
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
      console.log('ℹ️ Nenhuma notícia nova de tecnologia encontrada');
      return;
    }
    
    currentData = [...newArticles, ...currentData];
    currentData = currentData.slice(0, 50);
    
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    
    console.log(`✅ ${newArticles.length} novas notícias de tecnologia adicionadas`);
    console.log(`📊 Total de tecnologia: ${currentData.length}`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar tecnologia:', error.message);
    process.exit(1);
  }
}

updateTecnologia();