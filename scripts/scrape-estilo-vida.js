const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const { rewriteContent } = require("./ai-rewriter");
require("dotenv").config();

function createSlug(title) {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
function calculateReadTime(content) {
  return Math.max(1, Math.ceil(content.split(" ").length / 200));
}
async function fetchWithRetry(url, retries = 2) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });
      return response.data;
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

async function scrapeUOLLifestyle() {
  try {
    const html = await fetchWithRetry("https://www.uol.com.br/lifestyle/");
    const $ = cheerio.load(html);
    const articles = [];
    $("article, .news-item")
      .slice(0, 2)
      .each((i, element) => {
        const $el = $(element);
        const title = $el.find("h1, h2, h3").text().trim();
        const excerpt = $el.find("p").text().trim();
        const link = $el.find("a").attr("href");
        const image =
          $el.find("img").attr("src") || $el.find("img").attr("data-src");
        if (title && link && title.length > 10) {
          articles.push({
            title,
            originalTitle: title,
            excerpt: excerpt || title,
            link: link.startsWith("http")
              ? link
              : `https://www.uol.com.br${link}`,
            source: "UOL Lifestyle",
            image: image || null,
          });
        }
      });
    return articles;
  } catch (error) {
    console.error("Erro UOL Lifestyle:", error.message);
    return [];
  }
}

async function scrapeG1PopArte() {
  try {
    const html = await fetchWithRetry("https://g1.globo.com/pop-arte/");
    const $ = cheerio.load(html);
    const articles = [];
    $(".bastian-feed-item")
      .slice(0, 2)
      .each((i, element) => {
        const $el = $(element);
        const title = $el.find("a.feed-post-link").text().trim();
        const excerpt = $el.find(".feed-post-body-resumo").text().trim();
        const link = $el.find("a.feed-post-link").attr("href");
        const image =
          $el.find("img").attr("src") || $el.find("img").attr("data-src");
        if (title && link) {
          articles.push({
            title,
            originalTitle: title,
            excerpt: excerpt || title,
            link: link.startsWith("http")
              ? link
              : `https://g1.globo.com${link}`,
            source: "G1 Pop Arte",
            image: image || null,
          });
        }
      });
    return articles;
  } catch (error) {
    console.error("Erro G1 Pop Arte:", error.message);
    return [];
  }
}

async function scrapeTerraLifestyle() {
  try {
    const html = await fetchWithRetry("https://www.terra.com.br/lifestyle/");
    const $ = cheerio.load(html);
    const articles = [];
    $("article, .news-item")
      .slice(0, 2)
      .each((i, element) => {
        const $el = $(element);
        const title = $el.find("h1, h2, h3").text().trim();
        const excerpt = $el.find("p").text().trim();
        const link = $el.find("a").attr("href");
        const image =
          $el.find("img").attr("src") || $el.find("img").attr("data-src");
        if (title && link && title.length > 10) {
          articles.push({
            title,
            originalTitle: title,
            excerpt: excerpt || title,
            link: link.startsWith("http")
              ? link
              : `https://www.terra.com.br${link}`,
            source: "Terra Lifestyle",
            image: image || null,
          });
        }
      });
    return articles;
  } catch (error) {
    console.error("Erro Terra Lifestyle:", error.message);
    return [];
  }
}

async function getFullContent(article) {
  try {
    const html = await fetchWithRetry(article.link);
    const $ = cheerio.load(html);
    const selectors = [
      ".content-text__container p",
      ".mc-body p",
      ".post-content p",
      ".article-content p",
      ".content p",
      ".entry-content p",
      "article p",
    ];
    let content = "";
    for (const selector of selectors) {
      const paragraphs = $(selector)
        .map((i, el) => $(el).text().trim())
        .get()
        .filter((p) => p.length > 20);
      if (paragraphs.length > 0) {
        content = paragraphs.slice(0, 8).join(" ");
        break;
      }
    }
    const author =
      $(".author-name, .post-author").text().trim() || article.source;
    const publishedAt = $("time").attr("datetime") || new Date().toISOString();
    return {
      ...article,
      content: content || article.excerpt,
      author,
      publishedAt,
      tags: ["estilo-vida", "lifestyle"],
    };
  } catch (error) {
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ["estilo-vida", "lifestyle"],
    };
  }
}

function transformToFormat(articles) {
  return articles.map((article) => ({
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    title: article.title,
    originalTitle: article.originalTitle,
    slug: createSlug(article.title),
    excerpt: article.excerpt,
    content: `<p>${article.content}</p>`,
    image: article.image,
    category: "estilo-vida",
    author: article.author,
    publishedAt: article.publishedAt,
    updatedAt: new Date().toISOString(),
    tags: article.tags,
    readTime: calculateReadTime(article.content),
    featured: false,
    views: 0,
    sourceUrl: article.link,
  }));
}

async function updateEstiloVida() {
  try {
    console.log("🔄 Fazendo scraping de estilo de vida...");
    const [uol, g1, terra] = await Promise.allSettled([
      scrapeUOLLifestyle(),
      scrapeG1PopArte(),
      scrapeTerraLifestyle(),
    ]);
    const allArticles = [
      ...(uol.status === "fulfilled" ? uol.value : []),
      ...(g1.status === "fulfilled" ? g1.value : []),
      ...(terra.status === "fulfilled" ? terra.value : []),
    ];
    if (allArticles.length === 0) {
      console.log("⚠️ Nenhuma notícia de estilo de vida encontrada");
      return;
    }
    console.log(
      `💄 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`
    );
    const articlesWithContent = [];
    for (const article of allArticles) {
      const fullArticle = await getFullContent(article);
      console.log(`🤖 Reescrevendo: ${fullArticle.title.substring(0, 50)}...`);
      const rewritten = await rewriteContent(
        fullArticle.title,
        fullArticle.content
      );
      if (rewritten && rewritten.rewritten) {
        fullArticle.title = rewritten.title;
        fullArticle.content = rewritten.content;
        fullArticle.excerpt = rewritten.excerpt || '';
        fullArticle.author = `Criado via IA em ${new Date().toLocaleDateString(
          "pt-BR"
        )}`;
        articlesWithContent.push(fullArticle);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const formattedArticles = transformToFormat(articlesWithContent);
    const filePath = path.join(__dirname, "../src/data/json/estilo-vida.json");
    let currentData = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf8");
      currentData = JSON.parse(fileContent);
    } catch (error) {
      console.log("📄 Arquivo não existe, criando novo...");
    }
    const existingOriginalTitles = new Set(
      currentData.map(
        (item) => item.originalTitle?.toLowerCase() || item.title.toLowerCase()
      )
    );
    const newArticles = formattedArticles
      .filter(
        (article) =>
          !existingOriginalTitles.has(article.originalTitle.toLowerCase())
      )
      .slice(0, 6);
    if (newArticles.length === 0) {
      console.log("ℹ️ Nenhuma notícia nova de estilo de vida encontrada");
      return;
    }
    currentData = [...newArticles, ...currentData].slice(0, 50);
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    console.log(
      `✅ ${newArticles.length} novas notícias de estilo de vida adicionadas`
    );
    console.log(`📊 Total de estilo de vida: ${currentData.length}`);
  } catch (error) {
    console.error("❌ Erro ao atualizar estilo de vida:", error.message);
    process.exit(1);
  }
}

updateEstiloVida();
