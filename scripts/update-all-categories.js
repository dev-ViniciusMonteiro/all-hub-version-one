const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  'update-all-noticias.js',      // 1. Notícias/Política
  'scrape-esportes.js',          // 2. Esportes (GE Futebol)
  'scrape-tecnologia.js',        // 3. Tecnologia
  'scrape-saude.js',             // 4. Saúde & Bem-Estar (saude-bem-estar.json)
  'scrape-entretenimento.js',    // 5. Entretenimento
  'scrape-educacao.js',          // 6. Educação & Carreira (educacao-carreira.json)
  'scrape-utilidades.js',        // 7. Curiosidades & Tendências (utilidades.json)
  'scrape-estilo-vida.js',       // 8. Estilo de Vida
  'scrape-opiniao.js',           // 9. Opinião & Colunas (opiniao.json)
  'scrape-curriculo.js'          // 10. Especiais (curriculo.json)
];

async function runAllScripts() {
  console.log('🚀 Iniciando atualização de todas as categorias...\n');
  
  for (const script of scripts) {
    try {
      console.log(`▶️ Executando ${script}...`);
      execSync(`node ${path.join(__dirname, script)}`, { 
        stdio: 'inherit',
        cwd: path.dirname(__dirname)
      });
      console.log(`✅ ${script} concluído\n`);
    } catch (error) {
      console.error(`❌ Erro em ${script}:`, error.message);
    }
  }
  
  console.log('🎉 Atualização de todas as categorias concluída!');
  
  // Remover duplicatas
  console.log('\n🔄 Removendo duplicatas...');
  await removeDuplicates();
}

async function removeDuplicates() {
  const jsonFiles = [
    'noticias.json', 'esportes.json', 'tecnologia.json', 'saude-bem-estar.json',
    'entretenimento.json', 'educacao-carreira.json', 'utilidades.json', 
    'estilo-vida.json', 'opiniao.json', 'curriculo.json'
  ];
  
  for (const file of jsonFiles) {
    try {
      const filePath = path.join(__dirname, `../src/data/json/${file}`);
      const fs = require('fs').promises;
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (data.length === 0) continue;
      
      const originalCount = data.length;
      const seen = new Set();
      const unique = [];
      
      for (const item of data) {
        const key = (item.originalTitle || item.title).toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          unique.push(item);
        }
      }
      
      await fs.writeFile(filePath, JSON.stringify(unique, null, 2));
      
      const removedCount = originalCount - unique.length;
      if (removedCount > 0) {
        console.log(`✅ ${file}: ${removedCount} duplicatas removidas`);
      }
    } catch (error) {
      console.error(`❌ Erro em ${file}:`, error.message);
    }
  }
}

runAllScripts();