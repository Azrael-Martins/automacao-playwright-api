# Automação de API — Playwright (local)

Projeto **somente na máquina** (`local/api-automation/`). A pasta `local/` costuma estar no `.gitignore` do repositório principal — não vai para o GitHub.

Automação de API com **Playwright Test**, **Page Object Model (POM)** em **JavaScript (CommonJS)** e um único arquivo **`.env`** na raiz.

API sob teste: [ServeRest](https://serverest.dev/?lang=pt-BR) — documentação interativa em [Swagger](https://serverest.dev/swagger.json).

---

## Índice

- [Para quem é este projeto](#para-quem-é-este-projeto)
- [Glossário rápido](#glossário-rápido)
- [Primeiro uso (passo a passo)](#primeiro-uso-passo-a-passo)
- [Configuração — arquivo `.env`](#configuração--arquivo-env)
- [Como uma chamada HTTP funciona aqui](#como-uma-chamada-http-funciona-aqui)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Page Object Model na prática](#page-object-model-na-prática)
- [Testes que existem hoje](#testes-que-existem-hoje)
- [Como criar um novo teste](#como-criar-um-novo-teste)
- [Comandos úteis](#comandos-úteis)
- [Problemas frequentes](#problemas-frequentes)
- [Próximos passos](#próximos-passos)

---

## Para quem é este projeto

Este repositório serve para **estudar automação de API** com boas práticas:

- Testes em `tests/` — só **orquestram** e **validam** resultados.
- Endpoints e verbos HTTP ficam em `pages/` (Page Objects).
- Dados de teste ficam em `data/` e `data/builders/`.

Você não precisa abrir o Postman para cada teste: o Playwright envia as requisições por código.

---

## Glossário rápido

| Termo | Significado neste projeto |
|--------|---------------------------|
| **API** | Serviço na internet que responde a requisições HTTP (aqui: ServeRest). |
| **Endpoint** | Caminho do recurso, ex.: `/usuarios`. |
| **Verbo HTTP** | **GET** (ler), **POST** (criar), **PUT** (atualizar), **DELETE** (excluir). |
| **baseURL** | Host da API no `.env`; o Playwright concatena com o path (`usuarios`). |
| **`request`** | Cliente HTTP do Playwright; aparece no teste como `async ({ request })`. |
| **Payload** | Corpo JSON enviado no POST/PUT (ex.: dados do usuário). |
| **Page Object** | Classe que encapsula um recurso da API (`UsuariosPage` → `/usuarios`). |
| **Spec** | Arquivo de teste (`*.spec.js`). |

---

## Primeiro uso (passo a passo)

1. Abra o terminal na pasta `local/api-automation/`.
2. Instale dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz (copie o bloco da seção [Configuração](#configuração--arquivo-env)).
4. Rode os testes (é necessário **internet** — a API é pública):

   ```bash
   npm test
   ```

5. (Opcional) Abra o relatório HTML **depois** de rodar os testes:

   ```bash
   npm run report
   ```

---

## Configuração — arquivo `.env`

O `.env` **não vai para o Git**. Crie um na raiz do projeto:

```env
API_BASE_URL=https://serverest.dev
API_KEY=
API_TIMEOUT_MS=30000
```

| Variável | Descrição |
|----------|-----------|
| `API_BASE_URL` | URL base da API (**obrigatória**). Sem barra no final. |
| `API_KEY` | Opcional. Reservado para token após `POST /login` (testes atuais de usuário **não** usam). |
| `API_TIMEOUT_MS` | Tempo máximo de cada teste em milissegundos (padrão: 30000). |

**Cadastro de usuário** (`POST /usuarios`), conforme Swagger:

- `nome` (string)
- `email` (string única)
- `password` (string)
- `administrador` — `"true"` ou `"false"` (string, não boolean)

---

## Como uma chamada HTTP funciona aqui

```text
.env (API_BASE_URL)
    ↓
config/environment.js  →  lê variáveis
    ↓
playwright.config.js   →  baseURL: https://serverest.dev/
    ↓
teste: async ({ request })   →  Playwright cria o cliente HTTP
    ↓
new UsuariosPage(request)
    ↓
usuariosPage.create(payload)   →  basePage faz request.post('usuarios', { data })
    ↓
URL final: https://serverest.dev/usuarios
```

A **barra final** em `baseURL` no `playwright.config.js` é importante: paths relativos como `usuarios` viram `.../usuarios` e não `.../usuarios` perdendo o `/api` (em APIs com prefixo).

**Onde cada peça mora:**

| Peça | Onde |
|------|------|
| Host | `.env` → `playwright.config.js` (`baseURL`) |
| Path do recurso | `pages/usuariosPage.js` (`'usuarios'`) + `basePage._url()` |
| Cliente HTTP | Fixture `request` do Playwright |
| Corpo JSON | `data/builders/usuarioBuilder.js` → `create({ data: payload })` |

---

## Estrutura de pastas

```text
local/api-automation/
├── .env                      # Suas variáveis locais (não versionado)
├── .gitignore
├── README.md
├── package.json              # Scripts npm e dependências
├── playwright.config.js      # baseURL, timeout, pasta de testes
├── config/
│   └── environment.js        # Carrega .env e exporta apiBaseUrl, etc.
├── pages/
│   ├── basePage.js           # GET, POST, DELETE… (comum a todos os recursos)
│   └── usuariosPage.js       # Métodos do recurso /usuarios
├── data/
│   ├── usuarios.data.js      # Dados fixos (ex.: id inexistente)
│   └── builders/
│       └── usuarioBuilder.js # Gera usuário com email único
├── helpers/
│   └── responseAssertions.js # Valida status + JSON
└── tests/
    └── api/
        └── usuarios.spec.js  # Testes POST, GET, DELETE
```

---

## Page Object Model na prática

**Regra:** o spec **não** monta URL nem chama `request.get` direto. Ele usa métodos com nome de negócio.

| Swagger (ServeRest) | Método no `UsuariosPage` | Verbo HTTP |
|---------------------|--------------------------|------------|
| `GET /usuarios` | `list()` | GET |
| `GET /usuarios/{_id}` | `getById(id)` | GET |
| `POST /usuarios` | `create(payload)` | POST |
| `PUT /usuarios/{_id}` | `update(id, payload)` | PUT |
| `DELETE /usuarios/{_id}` | `remove(id)` | DELETE |

Exemplo mínimo no spec:

```javascript
const { test, expect } = require('@playwright/test');
const { UsuariosPage } = require('../../pages/usuariosPage');

test('exemplo', async ({ request }) => {
  const usuariosPage = new UsuariosPage(request);
  const response = await usuariosPage.list();
  expect(response.status()).toBe(200);
});
```

---

## Testes que existem hoje

Arquivo: [`tests/api/usuarios.spec.js`](tests/api/usuarios.spec.js)

| Teste | O que faz | Status esperado |
|-------|-----------|-----------------|
| POST /usuarios cadastra usuário | `buildUsuario()` + `create()` | 201 |
| GET /usuarios lista usuários | `list()` | 200, `quantidade` e `usuarios[]` |
| DELETE /usuarios/{_id} | `create()` depois `remove(_id)` | 200 na exclusão |

Helper usado: [`helpers/responseAssertions.js`](helpers/responseAssertions.js) — confere status HTTP e `Content-Type` JSON antes de devolver o body.

---

## Como criar um novo teste

1. **Swagger** — Confira método, path, body e respostas em [serverest.dev](https://serverest.dev/swagger.json).
2. **Page Object** — Se o recurso é novo, crie `pages/produtosPage.js` (copie o padrão de `usuariosPage.js`). Se é o mesmo recurso, adicione um método em `usuariosPage.js`.
3. **Dados** — Use `buildUsuario()` ou crie constantes em `data/`.
4. **Spec** — Novo `test('...', async ({ request }) => { ... })` em `usuarios.spec.js` ou novo arquivo em `tests/api/*.spec.js`.
5. **Validar** — `npm test`.

**Exercício sugerido:** teste `GET /usuarios/{_id}` após um `create`, usando `getById(created._id)` e validando `email` do payload.

**Evite:**

- URL completa hardcoded no spec (`https://serverest.dev/...`).
- Lógica de montagem de path HTTP no spec (deixe no Page Object).

---

## Comandos úteis

```bash
npm test              # Roda todos os testes em tests/api/
npm run report        # Abre relatório HTML (rode npm test antes)
```

---

## Problemas frequentes

| Sintoma | Causa provável | O que fazer |
|---------|----------------|-------------|
| `API_BASE_URL deve estar definida` | Sem `.env` ou variável vazia | Criar `.env` na raiz do projeto |
| Status 404 em tudo | `baseURL` ou path errado | Confira `.env` e se `playwright.config` usa ``${apiBaseUrl}/`` |
| Testes lentos ou timeout | Rede ou API fora | Aumente `API_TIMEOUT_MS` no `.env` |
| `npm run report` vazio | Não rodou testes antes | Execute `npm test` primeiro |
| Email já utilizado (400) | Mesmo email em execuções paralelas | Use `buildUsuario()` (email único) |

---

## Próximos passos

1. Page Object de **login** (`POST /login`) e uso de `API_KEY` / header `Authorization` para rotas de admin.
2. Recurso **produtos** ou **carrinhos** com novos arquivos em `pages/`.
3. Cenários negativos (email duplicado, id inexistente — ServeRest retorna **400** em vários casos, não 404).

---

**Referências:** [ServeRest](https://serverest.dev/?lang=pt-BR) · [Playwright API testing](https://playwright.dev/docs/api-testing)
