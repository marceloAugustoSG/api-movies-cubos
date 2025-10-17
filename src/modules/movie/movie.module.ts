import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../../database/prisma.service';
import { MovieRepository } from '../../shared/repositories/movie.repository';
import { UserRepository } from '../../shared/repositories/user.repository';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService, MovieRepository, UserRepository],
})
export class MovieModule {}
