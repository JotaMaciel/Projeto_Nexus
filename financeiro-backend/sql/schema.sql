-- ============================================
-- SCHEMA — Controle Financeiro Pessoal
-- ============================================

CREATE DATABASE IF NOT EXISTS financeiro_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE financeiro_db;

-- --------------------------------------------
-- Usuários
-- --------------------------------------------
CREATE TABLE usuarios (
  id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(100)        NOT NULL,
  email       VARCHAR(150)        NOT NULL UNIQUE,
  senha_hash  VARCHAR(255)        NOT NULL,
  criado_em   DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME          NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- --------------------------------------------
-- Categorias (pré-definidas + personalizadas)
-- --------------------------------------------
CREATE TABLE categorias (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED,                          -- NULL = categoria global
  nome         VARCHAR(60)  NOT NULL,
  tipo         ENUM('receita', 'despesa') NOT NULL,
  icone        VARCHAR(50),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE KEY uq_usuario_categoria (usuario_id, nome, tipo)
);

-- Categorias padrão
INSERT INTO categorias (usuario_id, nome, tipo, icone) VALUES
  (NULL, 'Salário',       'receita',  'wallet'),
  (NULL, 'Renda Extra',   'receita',  'plus-circle'),
  (NULL, 'Investimento',  'receita',  'trending-up'),
  (NULL, 'Alimentação',   'despesa',  'utensils'),
  (NULL, 'Transporte',    'despesa',  'car'),
  (NULL, 'Moradia',       'despesa',  'home'),
  (NULL, 'Saúde',         'despesa',  'heart'),
  (NULL, 'Lazer',         'despesa',  'smile'),
  (NULL, 'Educação',      'despesa',  'book'),
  (NULL, 'Outros',        'despesa',  'more-horizontal');

-- --------------------------------------------
-- Transações (despesas e receitas)
-- --------------------------------------------
CREATE TABLE transacoes (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED        NOT NULL,
  categoria_id INT UNSIGNED        NOT NULL,
  tipo         ENUM('receita','despesa') NOT NULL,
  valor        DECIMAL(12, 2)      NOT NULL CHECK (valor > 0),
  descricao    VARCHAR(255),
  data         DATE                NOT NULL,
  criado_em    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id),
  INDEX idx_usuario_data (usuario_id, data),
  INDEX idx_usuario_tipo (usuario_id, tipo)
);

-- --------------------------------------------
-- Orçamentos (limite por categoria/mês)
-- --------------------------------------------
CREATE TABLE orcamentos (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED        NOT NULL,
  categoria_id INT UNSIGNED,                          -- NULL = orçamento total do mês
  mes          TINYINT UNSIGNED    NOT NULL CHECK (mes BETWEEN 1 AND 12),
  ano          SMALLINT UNSIGNED   NOT NULL,
  limite       DECIMAL(12, 2)      NOT NULL CHECK (limite > 0),
  FOREIGN KEY (usuario_id)   REFERENCES usuarios(id)   ON DELETE CASCADE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL,
  UNIQUE KEY uq_orcamento (usuario_id, categoria_id, mes, ano)
);

-- --------------------------------------------
-- Histórico de interações com a IA
-- --------------------------------------------
CREATE TABLE historico_ia (
  id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  usuario_id   INT UNSIGNED        NOT NULL,
  papel        ENUM('user','assistant') NOT NULL,
  mensagem     TEXT                NOT NULL,
  criado_em    DATETIME            NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_ia (usuario_id, criado_em)
);
