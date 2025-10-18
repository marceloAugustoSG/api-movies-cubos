import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [UserModule, MovieModule, AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
