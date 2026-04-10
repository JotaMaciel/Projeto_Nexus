// Model: representa a estrutura de um Usuário
class Usuario {
  constructor({ id, nome, email, senha_hash, criado_em, atualizado_em }) {
    this.id           = id;
    this.nome         = nome;
    this.email        = email;
    this.senha_hash   = senha_hash;
    this.criado_em    = criado_em;
    this.atualizado_em = atualizado_em;
  }

  // Retorna o objeto sem expor a senha
  toPublic() {
    return { id: this.id, nome: this.nome, email: this.email, criado_em: this.criado_em };
  }
}

module.exports = Usuario;
