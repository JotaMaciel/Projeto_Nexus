class Orcamento {
  constructor({ id, usuario_id, categoria_id, mes, ano, limite }) {
    this.id           = id;
    this.usuario_id   = usuario_id;
    this.categoria_id = categoria_id; // null = orçamento geral do mês
    this.mes          = mes;
    this.ano          = ano;
    this.limite       = limite;
  }
}

module.exports = Orcamento;
