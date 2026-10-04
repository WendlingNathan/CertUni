# 🎓 CertUni

Plataforma integrada para gerenciamento de cursos, matrículas, usuários e emissão de certificados acadêmicos.

---

## 📌 Sobre o Projeto

O **CertUni** é uma aplicação web desenvolvida em arquitetura moderna de microsserviços/monorepo dividida em **Backend** e **Frontend**. A solução visa simplificar o ciclo de vida acadêmico, permitindo a gestão eficiente de usuários, turmas, matrículas e a validação/emissão de certificados.

---

## 🌐 Aplicação hospedada

| Serviço | Endereço |
| :--- | :--- |
| **Aplicação web** | [https://certuni-web.onrender.com](https://certuni-web.onrender.com) |
| **API** | [https://certuni-api.onrender.com](https://certuni-api.onrender.com) |

A aplicação web permite acessar o cadastro, o login, os painéis de aluno e
administrador e a validação pública de certificados. O frontend e o backend
estão publicados como serviços separados no Render e utilizam um banco de
dados PostgreSQL hospedado no Supabase.

> Como os serviços utilizam o plano gratuito do Render, o primeiro acesso após
> um período de inatividade pode levar alguns segundos enquanto o servidor é
> iniciado.

### Acessos rápidos

- [Criar uma conta](https://certuni-web.onrender.com/register)
- [Entrar na plataforma](https://certuni-web.onrender.com/login)
- [Validar um certificado](https://certuni-web.onrender.com/validate)

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL hospedado no [Supabase](https://supabase.com/)
- **Autenticação:** JWT (JSON Web Tokens) + Passport
- **Testes:** Jest (Unitários e E2E)

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (App Router & React)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Gerenciamento de Sessão:** Next.js Route Handlers + Context API

### **Hospedagem**
- **Frontend e Backend:** [Render](https://render.com/)
- **Banco de Dados:** [Supabase](https://supabase.com/)

---

## 📂 Estrutura do Repositório

```text
CertUni/
├── backend/                  # API NestJS
│   ├── prisma/               # Schema, migrations e configurações do banco
│   ├── src/
│   │   ├── auth/             # Autenticação, JwtGuard e RolesGuard
│   │   ├── users/            # Módulo de usuários
│   │   ├── courses/          # Módulo de cursos
│   │   ├── enrollments/      # Módulo de matrículas
│   │   └── certificates/     # Módulo de certificados
│   └── test/                 # Testes E2E
├── frontend/                 # Aplicação Next.js
│   ├── app/                  # App Router (páginas públicas e rotas protegidas)
│   ├── components/           # Componentes React reutilizáveis
│   ├── context/              # Contexto de autenticação global
│   └── lib/                  # Helpers e integração de API backend
└── database/                 # Documentação e modelos relacionais do banco
```

---

## 💻 Como executar localmente

### Pré-requisitos

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) 20 ou superior
- npm

No Windows PowerShell, os exemplos abaixo utilizam `npm.cmd` e `npx.cmd` para
evitar possíveis bloqueios da política de execução de scripts.

### Opção 1: executar somente o frontend

Esta é a forma mais simples de testar o projeto localmente. O frontend será
executado no computador e utilizará a API e o banco de dados já hospedados.

1. Clone o projeto e entre na pasta do frontend:

   ```powershell
   git clone https://github.com/WendlingNathan/CertUni.git
   cd CertUni/frontend
   ```

2. Instale as dependências:

   ```powershell
   npm.cmd install
   ```

3. Inicie a aplicação na porta `3001`:

   ```powershell
   npm.cmd run dev -- --port 3001
   ```

4. Acesse [http://localhost:3001](http://localhost:3001).

Por padrão, o frontend se comunica com a API publicada em
`https://certuni-api.onrender.com`. Como ela utiliza o plano gratuito do
Render, a primeira requisição após um período de inatividade pode demorar
alguns segundos.

### Opção 2: executar frontend e backend localmente

Nesta opção, os dois serviços são executados no computador. O backend pode
continuar utilizando o PostgreSQL hospedado no Supabase.

#### 1. Configurar o backend

Clone o projeto, caso ainda não tenha feito isso, e entre na pasta do backend:

```powershell
git clone https://github.com/WendlingNathan/CertUni.git
cd CertUni/backend
```

Crie o arquivo `backend/.env`:

```env
DATABASE_URL="URL_DO_POOLER_DO_SUPABASE"
DIRECT_URL="URL_DIRETA_OU_SESSION_POOLER_DO_SUPABASE"
JWT_SECRET="CHAVE_ALEATORIA_COM_PELO_MENOS_32_CARACTERES"
PORT=3000
CORS_ORIGIN="http://localhost:3001"
```

As URLs de conexão devem ser copiadas da área **Connect** do projeto no
Supabase. Nunca publique o arquivo `.env` ou suas credenciais no repositório.

Para gerar uma chave JWT local, execute:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Instale as dependências, gere o Prisma Client e aplique as migrations:

```powershell
npm.cmd install
npx.cmd prisma generate
npx.cmd prisma migrate deploy
```

Inicie a API:

```powershell
npm.cmd run start:dev
```

A API ficará disponível em [http://localhost:3000](http://localhost:3000).
Mantenha esse terminal aberto.

#### 2. Configurar o frontend

Abra outro terminal e entre na pasta do frontend:

```powershell
cd CertUni/frontend
```

Crie o arquivo `frontend/.env.local` para direcionar as requisições à API
local:

```env
BACKEND_API_URL=http://localhost:3000
```

Instale as dependências e inicie o frontend:

```powershell
npm.cmd install
npm.cmd run dev -- --port 3001
```

Acesse [http://localhost:3001/login](http://localhost:3001/login).

Ao final, os serviços estarão organizados assim:

```text
PostgreSQL no Supabase
          ↓
Backend local — http://localhost:3000
          ↓
Frontend local — http://localhost:3001
```

---

## 👥 Integrantes do Projeto

| Foto | Nome | GitHub |
| :---: | :--- | :---: |
| <img src="https://github.com/WendlingNathan.png" width="80px" style="border-radius:50%"> | **Nathan Ritter Wendling** | [@WendlingNathan](https://github.com/WendlingNathan) |
| <img src="https://github.com/marcoschons.png" width="80px" style="border-radius:50%"> | **Marco Antônio Schons Santos** | [@marcoschons](https://github.com/marcoschons) |
| <img src="https://github.com/EduardoNofre007.png" width="80px" style="border-radius:50%"> | **Eduardo Augusto Romio Nofre** | [@EduardoNofre007](https://github.com/EduardoNofre007) |
| <img src="https://github.com/PedroHBender.png" width="80px" style="border-radius:50%"> | **Pedro Henrique Bender Schwambach Saito** | [@PedroHBender](https://github.com/PedroHBender) |
