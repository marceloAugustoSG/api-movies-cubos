import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateMovieResponse, UpdateMovieResponse, FindMovieResponse, MovieListResponse, MovieResponse } from './types/movie.types';

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
