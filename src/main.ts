import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const corsOptions = {
    origin: (origin: string, callback: Function) => {
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://yourdomain.com',
        'https://www.yourdomain.com',
      ];
      
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`🚫 CORS bloqueado para origem: ${origin}`);
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    preflightContinue: false,
  };
  
  app.enableCors(corsOptions);

  app.use((req: any, res: any, next: any) => {
    const timestamp = new Date().toISOString();
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const origin = req.headers.origin || 'No Origin';
    
    console.log(`📱 ${timestamp} - ${req.method} ${req.path} - Origin: ${origin} - User-Agent: ${userAgent.substring(0, 50)}...`);
    
    if (req.path === '/auth/login') {
      console.log(`🔐 Tentativa de login - Origin: ${origin} - IP: ${req.ip}`);
    }
    
    next();
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

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
      'JWT-auth',
    )
    .addTag('auth', 'Endpoints de autenticação - registro, login e recuperação de senha')
    .addTag('users', 'Endpoints de gerenciamento de usuários - CRUD completo')
    .addTag('movies', 'Endpoints de gerenciamento de filmes - CRUD com filtros e paginação')
    .addTag('upload', 'Endpoints de upload de arquivos - imagens para S3')
    .addTag('email', 'Endpoints de envio de emails - personalizados e de recuperação')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  
  console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs`);
  console.log(`📖 Documentação alternativa: http://localhost:${port}/docs`);
}

bootstrap();
