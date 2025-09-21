const axios = require('axios');

async function rewriteContent(title, content) {
  console.log('🔑 API Key:', process.env.OPENROUTER_API_KEY ? `${process.env.OPENROUTER_API_KEY.substring(0, 15)}...` : 'NÃO ENCONTRADA');
  console.log('🔑 API Key completa:', process.env.OPENROUTER_API_KEY);
  
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('❌ OPENROUTER_API_KEY não configurada no .env');
    return null;
  }

  try {
    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
      model: "openai/gpt-5-mini",
      messages: [
          {
      "role": "system",
      "content": "Você é um gerador de notícias. Receberá alguns fatos e o nome do author. Deve devolver apenas um JSON válido no formato: {'titulo': 'título atrativo da notícia', 'content': 'reportagem completa em linguagem jornalística, com o estilo do author fornecido', 'author': 'nome do author'}. Regras: 1) O tom da reportagem deve seguir a persona do author: Luke Skywalker VMAI → dramática, Leia Organa VMAI → enfática, Han Solo VMAI → realista. 2) Não inclua referências a empresas, portais ou URLs. 3) Retorne somente o JSON, sem texto adicional."
    },
    {
      "role": "user",
      "content": `Título original: ${title} Conteúdo original: ${content.substring(0, 1000)}}`
    }
      
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 50000
    });

    let aiResponse = response.data.choices[0].message.content.trim();
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    
    try {
      const parsed = JSON.parse(aiResponse);
      return {
        title: parsed.titulo || parsed.title || title,
        content: parsed.content || content,
        rewritten: true
      };
    } catch (parseError) {
      return null;
    }
    
  } catch (error) {
    console.error('❌ Erro na API da IA:', error.response?.data || error.message);
    return null;
  }
}

module.exports = { rewriteContent };