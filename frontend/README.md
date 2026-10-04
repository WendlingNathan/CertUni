# CertUni Frontend

Frontend da plataforma CertUni construído com Next.js 16 (App Router), React 19,
TypeScript e Tailwind CSS 4.

## Requisitos

- Node.js 20 ou superior
- Backend NestJS da CertUni em execução

## Configuração

Por padrão, o servidor Next se comunica com a API compartilhada em
`https://certuni-api.onrender.com`. Para usar o backend local, crie um arquivo
`.env.local`:

```env
BACKEND_API_URL=http://localhost:3000
```

Ao executar também o backend local na porta 3000, inicie o frontend em outra
porta:

```bash
npm install
npm run dev -- --port 3001
```

## Deploy no Render

O `render.yaml` da raiz cria o frontend como o Web Service `certuni-web`. Ele
usa a pasta `frontend`, executa o build de produção do Next.js e se conecta à
API publicada em `https://certuni-api.onrender.com`.

Como a aplicação usa Route Handlers e cookies `httpOnly`, ela deve permanecer
como Web Service Node e não como Static Site.

Acesse `http://localhost:3001`. A raiz redireciona para o dashboard ou, quando
não há uma sessão válida, para `/login`.

## Autenticação

O navegador envia as credenciais às Route Handlers do próprio Next.js. Após o
login, o JWT retornado pelo backend é armazenado em cookie `httpOnly`, `SameSite`
e `Secure` em produção. O token não fica disponível para JavaScript do cliente.

- `POST /api/auth/login`: autentica e cria a sessão.
- `POST /api/auth/register`: cria uma conta pública com perfil `STUDENT`.
- `GET /api/auth/session`: revalida a sessão em `/auth/me`.
- `POST /api/auth/logout`: remove o cookie da sessão.
- `/api/backend/*`: encaminha chamadas autenticadas ao backend sem expor o JWT.

As páginas dentro de `app/(protected)` validam a sessão no servidor antes de
renderizar. Novas páginas privadas, como as previstas na Parte 2, devem ser
criadas nesse grupo.

## Validação

```bash
npm run lint
npm run build
```
