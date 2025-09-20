const fs = require('fs').promises;
const path = require('path');

async function updateNoticias() {
  try {
    const novasNoticias = [
      {
        id: Date.now().toString(),
        title: "Notícia Atualizada Automaticamente",
        slug: "noticia-automatica-" + Date.now(),
        excerpt: "Esta notícia foi criada pelo script automático em " + new Date().toLocaleString('pt-BR'),
        content: "Conteúdo gerado automaticamente pelo GitHub Actions...",
        category: "noticias",
        author: "Bot Automático",
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ["automático", "script", "github-actions"],
        readTime: 3,
        featured: false,
        views: 0
      }
    ];

    const filePath = path.join(__dirname, '../src/data/json/noticias.json');
    let currentData = [];
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      currentData = JSON.parse(fileContent);
    } catch (error) {
      console.log('Arquivo não existe, criando novo...');
    }

    novasNoticias.forEach(nova => {
      const exists = currentData.find(item => item.slug === nova.slug);
      if (!exists) {
        currentData.unshift(nova);
      }
    });

    currentData = currentData.slice(0, 50);

    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    
    console.log(`✅ Notícias atualizadas: ${currentData.length} itens`);
    
  } catch (error) {
    console.error('❌ Erro ao atualizar notícias:', error);
    process.exit(1);
  }
}

updateNoticias();