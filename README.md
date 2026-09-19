TAREFA 1: Módulo de Inscrições (EnrollmentModule) — Backend
Foco: Regras de negócio e relacionamento no banco de dados.

O que fazer:

Implementar o controller e o service para as inscrições dos alunos.

Rota POST /enrollments (STUDENT): Permitir que um aluno autenticado se inscreva em um curso enviando o courseId.

Regras de Negócio (Validações):

Validar se o curso realmente existe no banco.

Impedir que o mesmo aluno se inscreva duas vezes no mesmo curso (retornar erro 400 Bad Request).

Rota GET /enrollments/my-enrollments (STUDENT): Listar os cursos em que o aluno logado está inscrito.

Rota GET /enrollments/course/:courseId (ADMIN): Listar todos os alunos inscritos em um curso específico.

Rota DELETE /enrollments/:id (STUDENT/ADMIN): Permitir o cancelamento da inscrição.

--------------------------------------------------------------------------------------------------------

TAREFA 2: Módulo de Presenças e Certificados (CertificatesModule) — Backend
Foco: Lógica de conclusão, geração de código único e exportação de PDF.

O que fazer:

Rota PATCH /enrollments/:id/check-in ou attended (ADMIN): Marcar que o aluno compareceu ao evento.

Módulo de Emissão (POST /certificates/generate/:enrollmentId):

Verificar se a inscrição do aluno está marcada como "presente/concluída".

Gerar um código de validação único (hash/UUID) para o certificado.

Geração do Arquivo PDF:

Utilizar uma biblioteca Node.js (como pdfkit ou puppeteer) para renderizar o layout do certificado com dados dinâmicos: Nome do Aluno, Nome do Curso, Carga Horária, Data e Código de Validação.

Rota Pública GET /certificates/validate/:code: Rota pública para qualquer pessoa validar a autenticidade de um certificado inserindo o código.

--------------------------------------------------------------------------------------------------------

TAREFA 3: Frontend Next.js — Autenticação, Layout e Dashboard (Frontend - Parte 1)
Foco: Interface base, navegação e integração com o módulo de Auth/Users.

O que fazer:

Estruturar o projeto em Next.js (App Router ou Pages Router) com biblioteca de UI (Tailwind CSS, Shadcn/ui ou Material UI).

Página de Login (/login) e Cadastro (/register): Formulários integrados com as rotas POST /auth/login e POST /auth/register.

Gerenciamento de Estado/Token: Armazenar o JWT de forma segura (Cookies/LocalStorage) e criar um Context/Hook para tratar a sessão do usuário.

Rota Protegida e Redirecionamento: Garantir que páginas privadas redirecionem usuários não autenticados para a tela de login.

Layout Base: Header/Navbar com exibição dos dados do usuário logado e botão de Logout.

--------------------------------------------------------------------------------------------------------

TAREFA 4: Frontend Next.js — Catálogo, Inscrição e Painel Admin (Frontend - Parte 2)
Foco: Telas de cursos, interações do aluno e visão administrativa.

O que fazer:

Página de Catálogo de Cursos (/courses): Consumir a rota GET /courses e exibir os cards com informações do evento e palestrante.

Página do Aluno (/my-courses):

Botão "Inscrever-se" nos cards de cursos.

Lista de cursos em que o aluno já está inscrito.

Botão "Baixar Certificado" (disponível apenas se a presença foi confirmada).

Painel Administrativo (/admin):

Formulário para cadastrar novos cursos (POST /courses).

Tabela de alunos inscritos por curso com botão de Check-in (confirmar presença).
