const fs = require('fs').promises;
const path = require('path');

const jsonFiles = [
  'noticias.json',
  'esportes.json', 
  'tecnologia.json',
  'saude-bem-estar.json',
  'entretenimento.json',
  'educacao-carreira.json',
  'utilidades.json',
  'estilo-vida.json',
  'opiniao.json',
  'curriculo.json'
];

async function removeDuplicates() {
  console.log('🔄 Removendo duplicatas de todos os arquivos JSON...\n');
  
  for (const file of jsonFiles) {
    try {
      const filePath = path.join(__dirname, `../src/data/json/${file}`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (data.length === 0) {
        console.log(`📄 ${file}: Arquivo vazio`);
        continue;
      }
      
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
        console.log(`✅ ${file}: ${removedCount} duplicatas removidas (${originalCount} → ${unique.length})`);
      } else {
        console.log(`📄 ${file}: Nenhuma duplicata encontrada (${originalCount} artigos)`);
      }
      
    } catch (error) {
      console.error(`❌ Erro em ${file}:`, error.message);
    }
  }
  
  console.log('\n🎉 Limpeza de duplicatas concluída!');
}

removeDuplicates();