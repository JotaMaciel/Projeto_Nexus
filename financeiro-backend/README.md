# Financeiro Backend

Backend do sistema de controle financeiro pessoal, construído com Node.js + Express + MySQL.

---

## Requisitos

- Node.js 18+
- MySQL 8+

---

## Instalação

```bash
npm install
cp .env.example .env
# edite o .env com suas credenciais
```

Execute o schema no MySQL:
```bash
mysql -u root -p < sql/schema.sql
```

Inicie o servidor:
```bash
npm run dev   # desenvolvimento (nodemon)
npm start     # produção
```

---

## Estrutura

```
src/
├── config/       → conexão com o banco (pool MySQL2)
├── model/        → classes que representam as entidades
├── dao/          → acesso ao banco (queries SQL)
├── service/      → regras de negócio
├── controller/   → recebe req, chama service, retorna res
├── routes/       → define os endpoints e aplica middlewares
└── middleware/   → autenticação JWT
```

---

## Endpoints

### Auth — `/api/auth`

| Método | Rota            | Descrição              | Auth |
|--------|-----------------|------------------------|------|
| POST   | `/registrar`    | Criar conta            | ❌   |
| POST   | `/login`        | Login                  | ❌   |
| PUT    | `/perfil`       | Atualizar nome/email   | ✅   |
| PUT    | `/trocar-senha` | Alterar senha          | ✅   |

**POST /registrar**
```json
{ "nome": "João", "email": "joao@email.com", "senha": "123456" }
```

**POST /login**
```json
{ "email": "joao@email.com", "senha": "123456" }
```

---

### Transações — `/api/transacoes`  *(todas protegidas)*

| Método | Rota          | Descrição                          | RF     |
|--------|---------------|------------------------------------|--------|
| POST   | `/`           | Registrar despesa ou receita       | 02, 03 |
| GET    | `/`           | Histórico com filtros              | 07     |
| GET    | `/resumo`     | Resumo mensal (receitas/despesas)  | 05     |
| GET    | `/relatorio`  | Dados para gráficos                | 08     |
| PUT    | `/:id`        | Editar transação                   |        |
| DELETE | `/:id`        | Remover transação                  |        |

**POST /**
```json
{
  "categoria_id": 4,
  "tipo": "despesa",
  "valor": 45.90,
  "descricao": "Almoço",
  "data": "2025-06-10"
}
```

**GET / (filtros via query string)**
```
?tipo=despesa&categoria_id=4&data_inicio=2025-06-01&data_fim=2025-06-30&limite=20&offset=0
```

**GET /resumo**
```
?mes=6&ano=2025
→ { receitas: 3000, despesas: 1800, saldo: 1200 }
```

**GET /relatorio**
```
?mes=6&ano=2025
→ { por_categoria: [...], evolucao: [...] }
```

---

### Orçamentos — `/api/orcamentos`  *(todas protegidas)*

| Método | Rota       | Descrição                          | RF |
|--------|------------|------------------------------------|----|
| POST   | `/`        | Criar/atualizar orçamento          | 06 |
| GET    | `/`        | Listar orçamentos do mês           | 06 |
| GET    | `/status`  | Limite vs gasto real por categoria | 06 |
| DELETE | `/:id`     | Remover orçamento                  |    |

**POST /**
```json
{ "categoria_id": 4, "mes": 6, "ano": 2025, "limite": 500 }
```
> `categoria_id: null` define um orçamento total do mês.

**GET /status**
```
?mes=6&ano=2025
→ [{ categoria: "Alimentação", limite: 500, gasto: 320, disponivel: 180 }]
```

---

### Categorias — `/api/categorias`  *(todas protegidas)*

| Método | Rota   | Descrição                         | RF |
|--------|--------|-----------------------------------|----|
| GET    | `/`    | Listar globais + do usuário       | 04 |
| POST   | `/`    | Criar categoria personalizada     | 04 |
| DELETE | `/:id` | Remover categoria do usuário      |    |

**POST /**
```json
{ "nome": "Pets", "tipo": "despesa", "icone": "paw" }
```

---

### IA — `/api/ia`  *(todas protegidas)*

| Método | Rota          | Descrição                               | RF |
|--------|---------------|-----------------------------------------|----|
| POST   | `/chat`       | Chat com contexto financeiro do usuário | 09 |
| POST   | `/educacional`| Explicação educativa sobre um tópico   | 10 |
| DELETE | `/historico`  | Limpar histórico de conversa            |    |

**POST /chat**
```json
{ "mensagem": "Estou gastando muito. O que você sugere?" }
```

**POST /educacional**
```json
{ "topico": "O que é Tesouro Direto e como funciona?" }
```

---

## Autenticação

Todas as rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```
O token é retornado no login/registro.

---

## Variáveis de Ambiente

| Variável          | Descrição                        |
|-------------------|----------------------------------|
| PORT              | Porta do servidor (padrão: 3000) |
| DB_HOST           | Host do MySQL                    |
| DB_PORT           | Porta do MySQL (padrão: 3306)    |
| DB_USER           | Usuário do banco                 |
| DB_PASSWORD       | Senha do banco                   |
| DB_NAME           | Nome do banco                    |
| JWT_SECRET        | Chave secreta para os tokens     |
| JWT_EXPIRES_IN    | Validade do token (ex: 7d)       |
| ANTHROPIC_API_KEY | Chave da API da Anthropic (IA)   |
