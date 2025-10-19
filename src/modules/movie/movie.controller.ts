import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MovieFilterDto } from './dto/movie-filter.dto';
import { MovieFilterPaginatedDto } from './dto/movie-filter-paginated.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  CreateMovieResponse,
  UpdateMovieResponse,
  FindMovieResponse,
  MovieListResponse,
  MovieResponse,
  PaginatedMovieResponse,
} from './types/movie.types';

@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Request() req, @Body() createMovieDto: CreateMovieDto): Promise<CreateMovieResponse> {
    return this.movieService.create({ ...createMovieDto, userId: req.user.userId });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Request() req): Promise<MovieListResponse[]> {
    return this.movieService.findByUserId(req.user.userId);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  findAllPaginated(@Request() req, @Query() paginationDto: PaginationDto): Promise<PaginatedMovieResponse> {
    return this.movieService.findByUserIdPaginated(req.user.userId, paginationDto.page, paginationDto.limit);
  }

  @Get('filter')
  @HttpCode(HttpStatus.OK)
  findAllWithFilters(@Request() req, @Query() filterDto: MovieFilterDto): Promise<MovieListResponse[]> {
    const filtersWithUser = { ...filterDto, userId: req.user.userId };
    return this.movieService.findAllWithFilters(filtersWithUser);
  }

  @Get('filter/paginated')
  @HttpCode(HttpStatus.OK)
  findAllWithFiltersPaginated(@Request() req, @Query() filterPaginatedDto: MovieFilterPaginatedDto): Promise<PaginatedMovieResponse> {
    const { page, limit, ...filters } = filterPaginatedDto;
    const filtersWithUser = { ...filters, userId: req.user.userId };
    return this.movieService.findAllWithFiltersPaginated(filtersWithUser, page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Request() req, @Param('id') id: string): Promise<FindMovieResponse> {
    return this.movieService.findOneByUser(req.user.userId, +id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Request() req, @Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    return this.movieService.updateByUser(req.user.userId, +id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Request() req, @Param('id') id: string): Promise<MovieResponse> {
    return this.movieService.removeByUser(req.user.userId, +id);
  }
}
