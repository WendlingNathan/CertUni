# 🎓 CertUni

Plataforma integrada para gerenciamento de cursos, matrículas, usuários e emissão de certificados acadêmicos.

---

## 📌 Sobre o Projeto

O **CertUni** é uma aplicação web desenvolvida em arquitetura moderna de microsserviços/monorepo dividida em **Backend** e **Frontend**. A solução visa simplificar o ciclo de vida acadêmico, permitindo a gestão eficiente de usuários, turmas, matrículas e a validação/emissão de certificados.

---

## 🚀 Tecnologias Utilizadas

### **Backend**
- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Banco de Dados:** PostgreSQL / MySQL
- **Autenticação:** JWT (JSON Web Tokens) + Passport
- **Testes:** Jest (Unitários e E2E)

### **Frontend**
- **Framework:** [Next.js](https://nextjs.org/) (App Router & React)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Gerenciamento de Sessão:** Next.js Route Handlers + Context API

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

## 👥 Integrantes do Projeto

| Foto | Nome | GitHub |
| :---: | :--- | :---: |
| <img src="https://github.com/WendlingNathan.png" width="80px" style="border-radius:50%"> | **Nathan Ritter Wendling** | [@WendlingNathan](https://github.com/WendlingNathan) |
| <img src="https://github.com/marcoschons.png" width="80px" style="border-radius:50%"> | **Marco Antônio Schons Santos** | [@marcoschons](https://github.com/marcoschons) |
| <img src="https://github.com/EduardoNofre007.png" width="80px" style="border-radius:50%"> | **Eduardo Augusto Romio Nofre** | [@EduardoNofre007](https://github.com/EduardoNofre007) |
| <img src="https://github.com/PedroHBender.png" width="80px" style="border-radius:50%"> | **Pedro Henrique Bender Schwambach Saito** | [@PedroHBender](https://github.com/PedroHBender) |
