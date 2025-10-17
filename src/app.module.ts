import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from './modules/user/user.module';
import { MovieModule } from './modules/movie/movie.module';

@Module({
  imports: [UserModule, MovieModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
