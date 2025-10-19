import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocsController } from './docs.controller';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { UploadModule } from './modules/upload/upload.module';

/**
 * Módulo principal da aplicação
 * 
 * Este módulo configura todos os módulos da aplicação:
 * - AuthModule: Autenticação JWT, registro e login
 * - UserModule: Gerenciamento de usuários
 * - MovieModule: Gerenciamento de filmes com filtros e paginação
 * - EmailModule: Envio de emails personalizados
 * - UploadModule: Upload de imagens para S3
 * - DocsController: Endpoints públicos para documentação
 */
@Module({
  imports: [
    UserModule,     // CRUD de usuários
    MovieModule,    // CRUD de filmes com filtros e paginação
    AuthModule,     // Autenticação JWT e recuperação de senha
    EmailModule,    // Envio de emails
    UploadModule    // Upload de arquivos para S3
  ],
  controllers: [
    AppController,  // Controller principal com informações básicas
    DocsController  // Controller para documentação pública
  ],
  providers: [],
})
export class AppModule { }
