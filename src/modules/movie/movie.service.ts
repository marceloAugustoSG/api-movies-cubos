import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, Prisma } from 'generated/prisma';
import { MovieRepository } from '../../shared/repositories/movie.repository';
import { UserRepository } from '../../shared/repositories/user.repository';
import { ERROR_MESSAGES } from '../../shared/constants';
import { CreateMovieResponse, UpdateMovieResponse, FindMovieResponse, MovieListResponse, MovieResponse } from './types/movie.types';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly userRepository: UserRepository
  ) { }

  async create(createMovieDto: CreateMovieDto): Promise<CreateMovieResponse> {
    const user = await this.userRepository.findById(createMovieDto.userId);
    if (!user) {
      throw new NotFoundException(ERROR_MESSAGES.USER.NOT_FOUND);
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

    const movie = await this.movieRepository.create(movieData);
    return this.mapMovieToResponse(movie);
  }

  async findAll(): Promise<MovieListResponse[]> {
    const movies = await this.movieRepository.findMany();
    return movies.map(movie => this.mapMovieToResponse(movie));
  }

  async findOne(id: number): Promise<FindMovieResponse> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(ERROR_MESSAGES.MOVIE.NOT_FOUND);
    }
    return this.mapMovieToResponse(movie);
  }

  async findByUserId(userId: string): Promise<MovieListResponse[]> {
    const movies = await this.movieRepository.findByUserId(userId);
    return movies.map(movie => this.mapMovieToResponse(movie));
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    await this.findOne(id);
    const movie = await this.movieRepository.update(id, updateMovieDto);
    return this.mapMovieToResponse(movie);
  }

  async remove(id: number): Promise<MovieResponse> {
    await this.findOne(id);
    const movie = await this.movieRepository.delete(id);
    return this.mapMovieToResponse(movie);
  }

  private mapMovieToResponse(movie: any): MovieResponse {
    return {
      id: movie.id,
      title: movie.title,
      originalTitle: movie.originalTitle,
      description: movie.description,
      releaseDate: movie.releaseDate,
      duration: movie.duration,
      budget: movie.budget,
      imageUrl: movie.imageUrl,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      userId: movie.userId,
      user: movie.user ? {
        id: movie.user.id,
        name: movie.user.name,
        email: movie.user.email
      } : undefined
    } as MovieResponse;
  }
}