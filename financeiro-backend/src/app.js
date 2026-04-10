require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes      = require('./routes/auth.routes');
const transacaoRoutes = require('./routes/transacao.routes');
const orcamentoRoutes = require('./routes/orcamento.routes');
const categoriaRoutes = require('./routes/categoria.routes');
const iaRoutes        = require('./routes/ia.routes');

const app = express();

// ── Middlewares globais ──────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Rotas ────────────────────────────────────────────────────────
app.use('/api/auth',       authRoutes);       // RF-01
app.use('/api/transacoes', transacaoRoutes);  // RF-02, RF-03, RF-05, RF-07, RF-08
app.use('/api/orcamentos', orcamentoRoutes);  // RF-06
app.use('/api/categorias', categoriaRoutes);  // RF-04
app.use('/api/ia',         iaRoutes);         // RF-09, RF-10

// ── Health check ─────────────────────────────────────────────────
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// ── 404 ──────────────────────────────────────────────────────────
app.use((_, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

// ── Erro global ──────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
});

// ── Start ─────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
