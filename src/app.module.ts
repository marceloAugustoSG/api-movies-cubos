import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { DocsController } from './docs.controller';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmailModule } from './modules/email/email.module';
import { UploadModule } from './modules/upload/upload.module';
import { MobileDebugMiddleware } from './middleware/mobile-debug.middleware';

@Module({
  imports: [
    UserModule,
    MovieModule,
    AuthModule,
    EmailModule,
    UploadModule
  ],
  controllers: [
    AppController,
    DocsController
  ],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MobileDebugMiddleware)
      .forRoutes('*');
  }
}
