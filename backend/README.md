# CertUni API

API NestJS responsável por autenticação, cursos, inscrições, presenças e
certificados da plataforma CertUni. Os dados são persistidos em PostgreSQL com
Prisma ORM.

## Variáveis de ambiente

Crie `backend/.env` apenas para desenvolvimento local:

```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="uma-chave-aleatoria-e-secreta"
PORT=3000
```

Opcionalmente, limite as origens que podem chamar a API diretamente:

```env
CORS_ORIGIN="http://localhost:3001,https://seu-frontend.example"
```

Nunca envie o arquivo `.env` ao repositório.

## Desenvolvimento

```bash
npm install
npx prisma migrate deploy
npm run start:dev
```

A API local fica disponível em `http://localhost:3000`.

## Validação

```bash
npm run lint
npm run build
```

## Deploy no Render

O arquivo `render.yaml` na raiz do repositório define o serviço `certuni-api`.
Ao criar um Blueprint no Render, informe apenas os valores secretos solicitados:

- `DATABASE_URL`: conexão do Supabase usada pela aplicação.
- `DIRECT_URL`: conexão do Supabase usada pelas migrations.

O `JWT_SECRET` é criado automaticamente pelo Render. A cada deploy, o serviço:

1. instala as dependências;
2. gera o Prisma Client;
3. compila a aplicação;
4. aplica migrations pendentes;
5. inicia `dist/main.js` usando a porta fornecida pelo Render.

Após o deploy, configure no frontend:

```env
BACKEND_API_URL="https://certuni-api.onrender.com"
```

Use a URL exata exibida pelo Render e reinicie o frontend após alterar a
variável.
