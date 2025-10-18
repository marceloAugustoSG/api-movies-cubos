import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MovieFilterDto } from './dto/movie-filter.dto';
import { MovieFilterPaginatedDto } from './dto/movie-filter-paginated.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMovieResponse, UpdateMovieResponse, FindMovieResponse, MovieListResponse, MovieResponse, PaginatedMovieResponse } from './types/movie.types';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMovieDto: CreateMovieDto): Promise<CreateMovieResponse> {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<MovieListResponse[]> {
    return this.movieService.findAll();
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  findAllPaginated(@Query() paginationDto: PaginationDto): Promise<PaginatedMovieResponse> {
    return this.movieService.findAllPaginated(paginationDto.page, paginationDto.limit);
  }

  @Get('filter')
  @HttpCode(HttpStatus.OK)
  findAllWithFilters(@Query() filterDto: MovieFilterDto): Promise<MovieListResponse[]> {
    return this.movieService.findAllWithFilters(filterDto);
  }

  @Get('filter/paginated')
  @HttpCode(HttpStatus.OK)
  findAllWithFiltersPaginated(@Query() filterPaginatedDto: MovieFilterPaginatedDto): Promise<PaginatedMovieResponse> {
    const { page, limit, ...filters } = filterPaginatedDto;
    return this.movieService.findAllWithFiltersPaginated(filters, page, limit);
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  findByUserId(@Param('userId') userId: string): Promise<MovieListResponse[]> {
    return this.movieService.findByUserId(userId);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<FindMovieResponse> {
    return this.movieService.findOne(+id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    return this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string): Promise<MovieResponse> {
    return this.movieService.remove(+id);
  }
}
