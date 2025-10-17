import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { PrismaService } from '../prisma/prisma.service';
import { MovieRepository } from '../repositories/movie.repository';
import { UserRepository } from '../repositories/user.repository';

@Module({
  controllers: [MovieController],
  providers: [MovieService, PrismaService, MovieRepository, UserRepository],
})
export class MovieModule {}
