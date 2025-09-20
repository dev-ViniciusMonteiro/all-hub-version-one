const { execSync } = require('child_process');
const path = require('path');

const scripts = [
  { name: 'Notícias/Política', file: 'update-all-noticias.js' },
  { name: 'Esportes', file: 'scrape-esportes.js' },
  { name: 'Tecnologia', file: 'scrape-tecnologia.js' },
  { name: 'Saúde', file: 'scrape-saude.js' },
  { name: 'Entretenimento', file: 'scrape-entretenimento.js' },
  { name: 'Educação', file: 'scrape-educacao.js' },
  { name: 'Utilidades', file: 'scrape-utilidades.js' },
  { name: 'Estilo de Vida', file: 'scrape-estilo-vida.js' },
  { name: 'Opinião', file: 'scrape-opiniao.js' },
  { name: 'Currículo', file: 'scrape-curriculo.js' }
];

async function testAllSources() {
  console.log('🧪 TESTANDO TODAS AS FONTES DE DADOS\n');
  
  const results = [];
  
  for (const script of scripts) {
    try {
      console.log(`🔍 Testando ${script.name}...`);
      const output = execSync(`node ${path.join(__dirname, script.file)}`, { 
        encoding: 'utf8',
        cwd: path.dirname(__dirname),
        timeout: 60000 // 1 minuto timeout
      });
      
      results.push({ category: script.name, status: '✅ FUNCIONANDO', details: 'OK' });
      console.log(`✅ ${script.name} - OK\n`);
      
    } catch (error) {
      results.push({ category: script.name, status: '❌ FALHOU', details: error.message });
      console.log(`❌ ${script.name} - ERRO: ${error.message}\n`);
    }
  }
  
  // Resumo final
  console.log('\n📊 RESUMO FINAL:');
  console.log('='.repeat(50));
  
  const working = results.filter(r => r.status.includes('✅'));
  const failed = results.filter(r => r.status.includes('❌'));
  
  console.log(`\n✅ FUNCIONANDO (${working.length}/${results.length}):`);
  working.forEach(r => console.log(`   ${r.category}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ COM PROBLEMAS (${failed.length}/${results.length}):`);
    failed.forEach(r => console.log(`   ${r.category} - ${r.details}`));
  }
  
  console.log(`\n📈 Taxa de sucesso: ${Math.round((working.length / results.length) * 100)}%`);
}

testAllSources();