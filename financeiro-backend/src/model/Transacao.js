class Transacao {
  constructor({ id, usuario_id, categoria_id, tipo, valor, descricao, data, criado_em }) {
    this.id           = id;
    this.usuario_id   = usuario_id;
    this.categoria_id = categoria_id;
    this.tipo         = tipo;         // 'receita' | 'despesa'
    this.valor        = valor;
    this.descricao    = descricao;
    this.data         = data;
    this.criado_em    = criado_em;
  }
}

module.exports = Transacao;
