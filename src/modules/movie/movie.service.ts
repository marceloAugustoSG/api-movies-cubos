import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieFilterDto } from './dto/movie-filter.dto';
import { Movie, Prisma } from 'generated/prisma';
import { MovieRepository } from '../../shared/repositories/movie.repository';
import { UserRepository } from '../../shared/repositories/user.repository';
import { ERROR_MESSAGES } from '../../shared/constants';
import {
  CreateMovieResponse,
  UpdateMovieResponse,
  FindMovieResponse,
  MovieListResponse,
  MovieResponse,
  PaginatedMovieResponse,
} from './types/movie.types';

@Injectable()
export class MovieService {
  constructor(
    private readonly movieRepository: MovieRepository,
    private readonly userRepository: UserRepository,
  ) {}

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
      revenue: createMovieDto.revenue,
      profit: createMovieDto.profit,
      imageUrl: createMovieDto.imageUrl,
      slogan: createMovieDto.slogan,
      trailerUrl: createMovieDto.trailerUrl,
      rating: createMovieDto.rating,
      voteCount: createMovieDto.voteCount,
      ageRating: createMovieDto.ageRating,
      status: createMovieDto.status,
      language: createMovieDto.language,
      genres: createMovieDto.genres ? createMovieDto.genres.join(',') : null,
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

  async findByUserId(userId: string): Promise<MovieListResponse[]> {
    const movies = await this.movieRepository.findByUserId(userId);
    return movies.map(movie => this.mapMovieToResponse(movie));
  }

  async findByUserIdPaginated(userId: string, page: number = 1, limit: number = 10): Promise<PaginatedMovieResponse> {
    const result = await this.movieRepository.findManyByUserIdPaginated(userId, page, limit);
    return {
      movies: result.movies.map(movie => this.mapMovieToResponse(movie)),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages
      }
    };
  }

  async findOneByUser(userId: string, id: number): Promise<FindMovieResponse> {
    const movie = await this.movieRepository.findByIdAndUserId(id, userId);
    if (!movie) {
      throw new NotFoundException(ERROR_MESSAGES.MOVIE.NOT_FOUND);
    }
    return this.mapMovieToResponse(movie);
  }

  async updateByUser(userId: string, id: number, updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    await this.findOneByUser(userId, id);
    
    const updateData = {
      ...updateMovieDto,
      genres: updateMovieDto.genres ? updateMovieDto.genres.join(',') : undefined
    };
    
    const movie = await this.movieRepository.update(id, updateData);
    return this.mapMovieToResponse(movie);
  }

  async removeByUser(userId: string, id: number): Promise<MovieResponse> {
    await this.findOneByUser(userId, id);
    const movie = await this.movieRepository.delete(id);
    return this.mapMovieToResponse(movie);
  }

  async findAllPaginated(page: number = 1, limit: number = 10): Promise<PaginatedMovieResponse> {
    const result = await this.movieRepository.findManyPaginated(page, limit);
    
    return {
      movies: result.movies.map(movie => this.mapMovieToResponse(movie)),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages
      }
    };
  }

  async findAllWithFilters(filters: MovieFilterDto): Promise<MovieListResponse[]> {
    const movies = await this.movieRepository.findManyWithFilters(filters);
    return movies.map(movie => this.mapMovieToResponse(movie));
  }

  async findAllWithFiltersPaginated(
    filters: MovieFilterDto, 
    page: number = 1, 
    limit: number = 10
  ): Promise<PaginatedMovieResponse> {
    const result = await this.movieRepository.findManyWithFiltersPaginated(filters, page, limit);
    
    return {
      movies: result.movies.map(movie => this.mapMovieToResponse(movie)),
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: result.totalPages
      }
    };
  }

  async findOne(id: number): Promise<FindMovieResponse> {
    const movie = await this.movieRepository.findById(id);
    if (!movie) {
      throw new NotFoundException(ERROR_MESSAGES.MOVIE.NOT_FOUND);
    }
    return this.mapMovieToResponse(movie);
  }

  async update(id: number, updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    await this.findOne(id);
    
    const updateData = {
      ...updateMovieDto,
      genres: updateMovieDto.genres ? updateMovieDto.genres.join(',') : undefined
    };
    
    const movie = await this.movieRepository.update(id, updateData);
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
      revenue: movie.revenue,
      profit: movie.profit,
      imageUrl: movie.imageUrl,
      slogan: movie.slogan,
      trailerUrl: movie.trailerUrl,
      rating: movie.rating || 0,
      voteCount: movie.voteCount || 0,
      ageRating: movie.ageRating,
      status: movie.status,
      language: movie.language,
      genres: movie.genres ? movie.genres.split(',') : [],
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