const Anthropic      = require('@anthropic-ai/sdk');
const HistoricoIaDAO = require('../dao/HistoricoIaDAO');
const TransacaoDAO   = require('../dao/TransacaoDAO');
const OrcamentoDAO   = require('../dao/OrcamentoDAO');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é um assistente financeiro pessoal chamado Finn.
Seu objetivo é ajudar o usuário a entender seus gastos, tomar decisões financeiras melhores
e aprender sobre educação financeira e investimentos de forma simples e acessível.

Regras:
- Seja objetivo, claro e empático.
- Use linguagem simples, sem jargões desnecessários.
- Quando tiver dados financeiros do usuário, use-os para personalizar as respostas.
- Para RF-10 (educação financeira), explique conceitos de forma didática com exemplos práticos.
- Nunca recomende investimentos específicos como "compre X ação". Oriente sobre conceitos.`;

class IaService {
  // RF-09 — assistente personalizado
  async chat(usuario_id, mensagem_usuario) {
    // Busca contexto financeiro do mês atual
    const agora = new Date();
    const mes   = agora.getMonth() + 1;
    const ano   = agora.getFullYear();

    const [resumo, orcamentos, historico] = await Promise.all([
      TransacaoDAO.resumoMensal(usuario_id, mes, ano),
      OrcamentoDAO.statusOrcamento(usuario_id, mes, ano),
      HistoricoIaDAO.buscarUltimas(usuario_id, 20),
    ]);

    const contextoFinanceiro = `
Contexto financeiro atual do usuário (${mes}/${ano}):
- Receitas: R$ ${resumo.receitas.toFixed(2)}
- Despesas: R$ ${resumo.despesas.toFixed(2)}
- Saldo:    R$ ${resumo.saldo.toFixed(2)}
- Orçamentos: ${JSON.stringify(orcamentos)}
`.trim();

    // Monta histórico no formato da API
    const messages = [
      ...historico.map(h => ({ role: h.papel, content: h.mensagem })),
      { role: 'user', content: `${contextoFinanceiro}\n\nPergunta: ${mensagem_usuario}` },
    ];

    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages,
    });

    const resposta = response.content[0].text;

    // Persiste no histórico
    await HistoricoIaDAO.salvar({ usuario_id, papel: 'user',      mensagem: mensagem_usuario });
    await HistoricoIaDAO.salvar({ usuario_id, papel: 'assistant', mensagem: resposta });

    return resposta;
  }

  // RF-10 — conteúdo educacional
  async educacional(usuario_id, topico) {
    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system:     SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: `Explique de forma educativa e didática: ${topico}` }],
    });

    return response.content[0].text;
  }

  async limparHistorico(usuario_id) {
    await HistoricoIaDAO.limpar(usuario_id);
  }
}

module.exports = new IaService();
