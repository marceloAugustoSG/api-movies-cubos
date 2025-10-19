import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Função principal para inicializar a aplicação NestJS
 * Configura CORS, validação global, Swagger e inicia o servidor
 */
async function bootstrap() {
  // Criar instância da aplicação NestJS
  const app = await NestFactory.create(AppModule);

  // Configuração CORS para permitir requisições de diferentes origens
  app.enableCors({
    origin: true, // Permite todas as origens em desenvolvimento
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Permite cookies e headers de autenticação
  });

  // Configuração global de validação de dados
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades não definidas nos DTOs
    forbidNonWhitelisted: true, // Rejeita requisições com propriedades extras
    transform: true, // Transforma automaticamente os tipos de dados
  }));

  // Configuração da documentação Swagger/OpenAPI
  const config = new DocumentBuilder()
    .setTitle('API Movie Cubos')
    .setDescription('API completa para gerenciamento de filmes e usuários com autenticação JWT, upload de imagens e envio de emails')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Token JWT para autenticação - obtenha fazendo login em /auth/login',
        in: 'header',
      },
      'JWT-auth', // Nome da configuração de autenticação
    )
    .addTag('auth', 'Endpoints de autenticação - registro, login e recuperação de senha')
    .addTag('users', 'Endpoints de gerenciamento de usuários - CRUD completo')
    .addTag('movies', 'Endpoints de gerenciamento de filmes - CRUD com filtros e paginação')
    .addTag('upload', 'Endpoints de upload de arquivos - imagens para S3')
    .addTag('email', 'Endpoints de envio de emails - personalizados e de recuperação')
    .build();

  // Gerar documentação OpenAPI
  const document = SwaggerModule.createDocument(app, config);
  
  // Configurar Swagger UI - endpoint principal
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Mantém o token JWT entre sessões
    },
  });

  // Endpoint alternativo para documentação
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // Iniciar servidor na porta definida nas variáveis de ambiente ou 3000
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  console.log(`📖 Documentação alternativa: http://localhost:${port}/docs`);
}

// Inicializar aplicação
bootstrap();
