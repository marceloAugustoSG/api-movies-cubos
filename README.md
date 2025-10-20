# 🎬 API Movie Cubos

Uma API completa para gerenciamento de filmes e usuários, desenvolvida com NestJS, Prisma e PostgreSQL.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

## 📋 Índice

- [Características](#-características)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [Documentação da API](#-documentação-da-api)
- [Endpoints](#-endpoints)
- [Autenticação](#-autenticação)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)

## ✨ Características

- 🔐 **Autenticação JWT** completa com registro e login
- 👥 **Gerenciamento de usuários** com CRUD completo
- 🎬 **Gerenciamento de filmes** com filtros e paginação
- 📤 **Upload de imagens** para Amazon S3
- 📧 **Envio de emails** personalizados via Resend
- 📚 **Documentação interativa** com Swagger
- 🔒 **Validação de dados** com class-validator
- 🌐 **CORS configurado** para desenvolvimento e produção
- 📱 **Suporte mobile** com logs de debug
- 🚀 **Pronto para produção** com configurações otimizadas

## 🛠 Tecnologias

### Backend
- **[NestJS](https://nestjs.com/)** - Framework Node.js
- **[TypeScript](https://www.typescriptlang.org/)** - Linguagem de programação
- **[Prisma](https://www.prisma.io/)** - ORM para banco de dados
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados
- **[JWT](https://jwt.io/)** - Autenticação
- **[bcrypt](https://www.npmjs.com/package/bcrypt)** - Criptografia de senhas

### Serviços Externos
- **[Amazon S3](https://aws.amazon.com/s3/)** - Armazenamento de arquivos
- **[Resend](https://resend.com/)** - Envio de emails
- **[Supabase](https://supabase.com/)** - Banco de dados em nuvem

### Documentação
- **[Swagger/OpenAPI](https://swagger.io/)** - Documentação interativa
- **[class-validator](https://github.com/typestack/class-validator)** - Validação de DTOs

## 📋 Pré-requisitos

- Node.js (v18 ou superior)
- Yarn ou npm
- PostgreSQL (local ou Supabase)
- Conta AWS (para S3)
- Conta Resend (para emails)

## 🚀 Instalação

1. **Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/api-movie-cubos.git
cd api-movie-cubos
```

2. **Instale as dependências:**
```bash
yarn install
# ou
npm install
```

3. **Configure as variáveis de ambiente:**
```bash
cp env.example .env
```

4. **Configure o banco de dados:**
```bash
# Gerar cliente Prisma
yarn prisma:generate

# Executar migrações
yarn prisma:migrate

# (Opcional) Abrir Prisma Studio
yarn prisma:studio
```

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/moviesdb?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key-here"
FRONTEND_URL="http://localhost:3000"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="movies-api-images"
```

### Configuração do Banco de Dados

1. **Local (PostgreSQL):**
```bash
# Instalar PostgreSQL
# Criar banco de dados
createdb moviesdb

# Executar migrações
yarn prisma:migrate
```

2. **Supabase (Recomendado para produção):**
```bash
# Criar projeto no Supabase
# Copiar DATABASE_URL
# Configurar no .env
```

## 🎯 Uso

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
yarn start:dev

# Build para produção
yarn build

# Iniciar em modo produção
yarn start:prod
```

### Scripts Disponíveis

```bash
# Desenvolvimento
yarn start:dev          # Inicia com hot-reload
yarn start:debug        # Inicia em modo debug

# Build e Produção
yarn build              # Compila TypeScript
yarn start:prod         # Inicia versão compilada

# Banco de Dados
yarn prisma:generate    # Gera cliente Prisma
yarn prisma:migrate     # Executa migrações
yarn prisma:studio      # Abre Prisma Studio
yarn prisma:push        # Push schema para banco

# Testes
yarn test               # Executa testes unitários
yarn test:e2e           # Executa testes e2e
yarn test:cov           # Executa testes com coverage

# Qualidade de Código
yarn lint               # Executa ESLint
yarn format             # Formata código com Prettier
```

## 📚 Documentação da API

A API possui documentação interativa completa:

- **Swagger UI:** `http://localhost:3000/api/docs`
- **Documentação Alternativa:** `http://localhost:3000/docs`
- **Informações da API:** `http://localhost:3000/docs/info`

### Recursos da Documentação

- ✅ **Teste interativo** de todos os endpoints
- ✅ **Exemplos de requisição** e resposta
- ✅ **Autenticação JWT** integrada
- ✅ **Validação de dados** em tempo real
- ✅ **Códigos de status HTTP** documentados

## 🔗 Endpoints

### 🔐 Autenticação (`/auth`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/auth/register` | Registrar novo usuário | ❌ |
| POST | `/auth/login` | Fazer login | ❌ |
| POST | `/auth/forgot-password` | Solicitar redefinição de senha | ❌ |
| POST | `/auth/reset-password` | Redefinir senha | ❌ |

### 👥 Usuários (`/users`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/users` | Criar usuário | ❌ |
| GET | `/users` | Listar usuários | ❌ |
| GET | `/users/:id` | Buscar usuário por ID | ❌ |
| PATCH | `/users/:id` | Atualizar usuário | ❌ |
| DELETE | `/users/:id` | Deletar usuário | ❌ |

### 🎬 Filmes (`/movies`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/movies` | Criar filme | ✅ |
| GET | `/movies` | Listar filmes do usuário | ✅ |
| GET | `/movies/paginated` | Listar com paginação | ✅ |
| GET | `/movies/filter` | Filtrar filmes | ✅ |
| GET | `/movies/filter/paginated` | Filtrar com paginação | ✅ |
| GET | `/movies/:id` | Buscar filme por ID | ✅ |
| PATCH | `/movies/:id` | Atualizar filme | ✅ |
| DELETE | `/movies/:id` | Deletar filme | ✅ |

### 📤 Upload (`/upload`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/upload/image` | Upload de imagem | ✅ |
| POST | `/upload/presigned-url` | Gerar URL pré-assinada | ✅ |

### 📧 Email (`/email`)
| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/email/send` | Enviar email personalizado | ✅ |
| POST | `/email/send-password-reset` | Enviar email de redefinição | ✅ |

## 🔑 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação.

### Como Autenticar

1. **Fazer login:**
```bash
POST /auth/login
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

2. **Usar o token:**
```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Exemplo de Uso

```javascript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'usuario@exemplo.com',
    password: 'senha123'
  })
});

const { access_token } = await response.json();

// Usar token em requisições autenticadas
const movies = await fetch('/movies', {
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json',
  }
});
```


3. **Build Command:** `yarn install && yarn build`
4. **Start Command:** `yarn start:prod`




## 🧪 Testes

```bash
# Testes unitários
yarn test

```

## 📊 Estrutura do Projeto

```
src/
├── modules/
│   ├── auth/           # Autenticação
│   ├── user/           # Usuários
│   ├── movie/          # Filmes
│   ├── upload/         # Upload de arquivos
│   └── email/          # Envio de emails
├── shared/
│   ├── services/       # Serviços compartilhados
│   └── repositories/   # Repositórios
├── database/
│   └── prisma.service.ts
├── middleware/
│   └── mobile-debug.middleware.ts
├── docs.controller.ts
├── app.module.ts
└── main.ts
```






🔗 **Live Demo:** [API de filmes ](hhttps://api-movies-cubos.onrender.com)