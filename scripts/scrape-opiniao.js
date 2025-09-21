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

async function scrapeFolhaOpiniao() {
  try {
    const html = await fetchWithRetry("https://www1.folha.uol.com.br/opiniao/");
    const $ = cheerio.load(html);
    const articles = [];
    $(".c-headline, .c-main-headline")
      .slice(0, 5)
      .each((i, element) => {
        const $el = $(element);
        const title = $el.find("h1, h2, h3, .c-headline__title").text().trim();
        const excerpt = $el.find("p, .c-headline__standfirst").text().trim();
        const link = $el.find("a").attr("href");
        const image =
          $el.find("img").attr("src") || $el.find("img").attr("data-src");
        if (title && link && title.length > 15) {
          articles.push({
            title,
            originalTitle: title,
            excerpt: excerpt || title.substring(0, 150) + "...",
            link: link.startsWith("http")
              ? link
              : `https://www1.folha.uol.com.br${link}`,
            source: "Folha Opinião",
            image: image || null,
          });
        }
      });
    return articles;
  } catch (error) {
    console.error("Erro Folha Opinião:", error.message);
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
      tags: ["opinião", "colunas"],
    };
  } catch (error) {
    return {
      ...article,
      content: article.excerpt,
      author: article.source,
      publishedAt: new Date().toISOString(),
      tags: ["opinião", "colunas"],
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
    category: "opiniao-colunas",
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

async function updateOpiniao() {
  try {
    console.log("🔄 Fazendo scraping de opinião...");
    const [folha] = await Promise.allSettled([scrapeFolhaOpiniao()]);

    // Log do status de cada fonte
    console.log("📊 Status das fontes:");
    console.log(
      `   Folha Opinião: ${
        folha.status === "fulfilled"
          ? "✅ OK (" + folha.value.length + " artigos)"
          : "❌ FALHOU - " + folha.reason?.message
      }`
    );

    const allArticles = [...(folha.status === "fulfilled" ? folha.value : [])];
    if (allArticles.length === 0) {
      console.log("⚠️ Nenhuma opinião encontrada");
      return;
    }
    console.log(
      `💭 ${allArticles.length} artigos encontrados, buscando conteúdo completo...`
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
    const filePath = path.join(__dirname, "../src/data/json/opiniao.json");
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
      console.log("ℹ️ Nenhuma opinião nova encontrada");
      return;
    }
    currentData = [...newArticles, ...currentData].slice(0, 50);
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    console.log(`✅ ${newArticles.length} novas opiniões adicionadas`);
    console.log(`📊 Total de opiniões: ${currentData.length}`);
  } catch (error) {
    console.error("❌ Erro ao atualizar opinião:", error.message);
    process.exit(1);
  }
}

updateOpiniao();
