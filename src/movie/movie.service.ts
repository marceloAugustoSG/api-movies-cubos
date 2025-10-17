import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, Prisma } from 'generated/prisma';
import { MovieRepository } from '../repositories/movie.repository';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly userRepository: UserRepository
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const user = await this.userRepository.findById(createMovieDto.userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const movieData: Prisma.MovieCreateInput = {
      title: createMovieDto.title,
      originalTitle: createMovieDto.originalTitle,
      description: createMovieDto.description,
      releaseDate: new Date(createMovieDto.releaseDate),
      duration: createMovieDto.duration,
      budget: createMovieDto.budget,
      imageUrl: createMovieDto.imageUrl,
      user: {
        connect: { id: createMovieDto.userId }
      }
    };

    return this.movieRepository.create(movieData);
  }

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.findMany();
  }

  async findOne(id: number): Promise<Movie> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException('Filme não encontrado');
    }
    return movie;
  }

  async findByUserId(userId: string): Promise<Movie[]> {
    return this.movieRepository.findByUserId(userId);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<Movie> {
    await this.findOne(id);

    const updateData: Prisma.MovieUpdateInput = {
      title: updateMovieDto.title,
      originalTitle: updateMovieDto.originalTitle,
      description: updateMovieDto.description,
      releaseDate: updateMovieDto.releaseDate,
      duration: updateMovieDto.duration,
      budget: updateMovieDto.budget,
      imageUrl: updateMovieDto.imageUrl,
    };

    return this.movieRepository.update(id, updateData);
  }

  async remove(id: number): Promise<Movie> {
    await this.findOne(id);
    return this.movieRepository.delete(id);
  }
}
