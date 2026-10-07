# Automação de API — Playwright

Repositório: [automacao-playwright-api](https://github.com/Azrael-Martins/automacao-playwright-api) (público) — branch padrão: `automacao-playwright-api`.

Automação de API com **Playwright Test**, camada **`api/`** (cliente HTTP + endpoints), **fixtures** e **JavaScript (CommonJS)**. Variáveis em **`.env`** na raiz (não versionado); use **`.env.example`** como modelo.

API sob teste: [ServeRest](https://serverest.dev/?lang=pt-BR) — documentação interativa em [Swagger](https://serverest.dev/swagger.json).

---

## Índice

- [Para quem é este projeto](#para-quem-é-este-projeto)
- [Glossário rápido](#glossário-rápido)
- [Primeiro uso (passo a passo)](#primeiro-uso-passo-a-passo)
- [Configuração — arquivo `.env`](#configuração--arquivo-env)
- [Como uma chamada HTTP funciona aqui](#como-uma-chamada-http-funciona-aqui)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Camada API na prática](#camada-api-na-prática)
- [Testes que existem hoje](#testes-que-existem-hoje)
- [Como criar um novo teste](#como-criar-um-novo-teste)
- [Comandos úteis](#comandos-úteis)
- [Problemas frequentes](#problemas-frequentes)
- [Próximos passos](#próximos-passos)

---

## Para quem é este projeto

Este repositório serve para **estudar automação de API** com boas práticas:

- Testes em `tests/` — só **orquestram** e **validam** resultados.
- Chamadas HTTP ficam em `api/endpoints/` (classes por recurso).
- Transporte comum (verbos, headers, paths) em `api/core/ApiClient.js`.
- Dados de teste em `api/data/` e `api/data/builders/`.

Você não precisa abrir o Postman para cada teste: o Playwright envia as requisições por código.

---

## Glossário rápido

| Termo | Significado neste projeto |
|--------|---------------------------|
| **API** | Serviço na internet que responde a requisições HTTP (aqui: ServeRest). |
| **Endpoint** | Caminho do recurso, ex.: `/usuarios`. |
| **Verbo HTTP** | **GET** (ler), **POST** (criar), **PUT** (atualizar), **DELETE** (excluir). |
| **baseURL** | Host da API no `.env`; o Playwright concatena com o path (`usuarios`). |
| **`request`** | Cliente HTTP do Playwright; usado por `ApiClient`. |
| **`usuariosApi`** | Fixture Playwright: instância pronta de `UsuariosApi`. |
| **Payload** | Corpo JSON enviado no POST/PUT (ex.: dados do usuário). |
| **Spec** | Arquivo de teste (`*.spec.js`). |

---

## Primeiro uso (passo a passo)

1. Abra o terminal na pasta do projeto (`api-automation/`).
2. Instale dependências:

   ```bash
   npm install
   ```

3. Crie o arquivo `.env` na raiz (copie de [`.env.example`](.env.example) ou da seção [Configuração](#configuração--arquivo-env)).
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

O `.env` **não vai para o Git**. Modelo versionado: [`.env.example`](.env.example).

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
fixtures/api.fixture.js  →  usuariosApi (UsuariosApi + request)
    ↓
usuariosApi.create(payload)  →  ApiClient.post → request HTTP
    ↓
URL final: https://serverest.dev/usuarios
```

A **barra final** em `baseURL` no `playwright.config.js` é importante: paths relativos como `usuarios` viram `.../usuarios` corretamente.

**Onde cada peça mora:**

| Peça | Onde |
|------|------|
| Host | `.env` → `playwright.config.js` (`baseURL`) |
| Path do recurso | `api/endpoints/UsuariosApi.js` (`'usuarios'`) + `ApiClient._url()` |
| Cliente HTTP | Fixture `request` do Playwright, encapsulado em `ApiClient` |
| Corpo JSON | `api/data/builders/usuario.builder.js` → `create({ data: payload })` |

---

## Estrutura de pastas

```text
api-automation/
├── .env                      # Suas variáveis locais (não versionado)
├── .env.example              # Modelo de variáveis
├── .gitignore
├── README.md
├── package.json
├── playwright.config.js
├── api/
│   ├── core/
│   │   └── ApiClient.js      # GET, POST, DELETE… (comum a todos os recursos)
│   ├── endpoints/
│   │   └── UsuariosApi.js    # Métodos do recurso /usuarios
│   └── data/
│       ├── usuarios.data.js  # Dados fixos (ex.: id inexistente)
│       └── builders/
│           └── usuario.builder.js
├── config/
│   └── environment.js
├── fixtures/
│   └── api.fixture.js        # test.extend com usuariosApi
├── helpers/
│   └── responseAssertions.js
└── tests/
    └── api/
        └── usuarios/
            ├── criar-usuario.spec.js
            ├── consultar-usuario.spec.js
            └── excluir-usuario.spec.js
```

---

## Camada API na prática

**Regra:** o spec **não** monta URL nem chama `request.get` direto. Usa a fixture `usuariosApi` e métodos com nome de negócio.

| Swagger (ServeRest) | Método no `UsuariosApi` | Verbo HTTP |
|---------------------|-------------------------|------------|
| `GET /usuarios` | `list()` | GET |
| `GET /usuarios/{_id}` | `getById(id)` | GET |
| `POST /usuarios` | `create(payload)` | POST |
| `PUT /usuarios/{_id}` | `update(id, payload)` | PUT |
| `DELETE /usuarios/{_id}` | `remove(id)` | DELETE |

Exemplo mínimo no spec:

```javascript
const { test, expect } = require('../../../fixtures/api.fixture');

test('exemplo', async ({ usuariosApi }) => {
  const response = await usuariosApi.list();
  expect(response.status()).toBe(200);
});
```

---

## Testes que existem hoje

Pasta: [`tests/api/usuarios/`](tests/api/usuarios/)

| Arquivo | O que faz | Status esperado |
|---------|-----------|-----------------|
| `criar-usuario.spec.js` | `buildUsuario()` + `create()` | 201 |
| `consultar-usuario.spec.js` | `list()` | 200, `quantidade` e `usuarios[]` |
| `excluir-usuario.spec.js` | `create()` depois `remove(_id)` | 200 na exclusão |

Helper usado: [`helpers/responseAssertions.js`](helpers/responseAssertions.js) — confere status HTTP e `Content-Type` JSON antes de devolver o body.

---

## Como criar um novo teste

1. **Swagger** — Confira método, path, body e respostas em [serverest.dev](https://serverest.dev/swagger.json).
2. **Endpoint** — Novo recurso: crie `api/endpoints/NovoRecursoApi.js` (copie o padrão de `UsuariosApi.js`). Mesmo recurso: adicione método na classe existente.
3. **Fixture** — Registre a nova API em `fixtures/api.fixture.js` se quiser injeção automática.
4. **Dados** — Use `buildUsuario()` ou constantes em `api/data/`.
5. **Spec** — Novo arquivo em `tests/api/<recurso>/<acao>.spec.js`; importe `test` de `fixtures/api.fixture.js`.
6. **Validar** — `npm test`.

**Exercício sugerido:** teste `GET /usuarios/{_id}` após um `create`, usando `getById(created._id)` e validando `email` do payload.

**Evite:**

- URL completa hardcoded no spec (`https://serverest.dev/...`).
- Lógica de montagem de path HTTP no spec (deixe em `ApiClient` / `*Api`).

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
| `API_BASE_URL deve estar definida` | Sem `.env` ou variável vazia | Copie `.env.example` para `.env` |
| Status 404 em tudo | `baseURL` ou path errado | Confira `.env` e se `playwright.config` usa ``${apiBaseUrl}/`` |
| Testes lentos ou timeout | Rede ou API fora | Aumente `API_TIMEOUT_MS` no `.env` |
| `npm run report` vazio | Não rodou testes antes | Execute `npm test` primeiro |
| Email já utilizado (400) | Mesmo email em execuções paralelas | Use `buildUsuario()` (email único) |

---

**Referências:** [ServeRest](https://serverest.dev/?lang=pt-BR) · [Playwright API testing](https://playwright.dev/docs/api-testing)
