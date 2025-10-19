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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('movies')
@ApiBearerAuth('JWT-auth')
@Controller('movies')
@UseGuards(JwtAuthGuard)
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Criar novo filme',
    description: 'Adiciona um novo filme à lista do usuário autenticado'
  })
  @ApiBody({ type: CreateMovieDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Filme criado com sucesso',
    schema: {
      example: {
        message: 'Filme criado com sucesso',
        movie: {
          id: 1,
          title: 'O Poderoso Chefão',
          description: 'Um clássico do cinema',
          genre: 'Drama',
          year: 1972,
          rating: 9.2,
          userId: 1,
          createdAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  create(@Request() req, @Body() createMovieDto: CreateMovieDto): Promise<CreateMovieResponse> {
    return this.movieService.create({ ...createMovieDto, userId: req.user.userId });
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Listar filmes do usuário',
    description: 'Retorna todos os filmes do usuário autenticado'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de filmes retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'O Poderoso Chefão' },
          description: { type: 'string', example: 'Um clássico do cinema' },
          genre: { type: 'string', example: 'Drama' },
          year: { type: 'number', example: 1972 },
          rating: { type: 'number', example: 9.2 }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  findAll(@Request() req): Promise<MovieListResponse[]> {
    return this.movieService.findByUserId(req.user.userId);
  }

  @Get('paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Listar filmes com paginação',
    description: 'Retorna os filmes do usuário com paginação'
  })
  @ApiQuery({ 
    name: 'page', 
    description: 'Número da página',
    example: 1,
    required: false
  })
  @ApiQuery({ 
    name: 'limit', 
    description: 'Quantidade de itens por página',
    example: 10,
    required: false
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de filmes retornada com sucesso',
    schema: {
      example: {
        movies: [
          {
            id: 1,
            title: 'O Poderoso Chefão',
            description: 'Um clássico do cinema',
            genre: 'Drama',
            year: 1972,
            rating: 9.2
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  findAllPaginated(@Request() req, @Query() paginationDto: PaginationDto): Promise<PaginatedMovieResponse> {
    return this.movieService.findByUserIdPaginated(req.user.userId, paginationDto.page, paginationDto.limit);
  }

  @Get('filter')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Filtrar filmes',
    description: 'Retorna filmes do usuário com filtros aplicados'
  })
  @ApiQuery({ 
    name: 'title', 
    description: 'Filtrar por título',
    required: false
  })
  @ApiQuery({ 
    name: 'genre', 
    description: 'Filtrar por gênero',
    required: false
  })
  @ApiQuery({ 
    name: 'year', 
    description: 'Filtrar por ano',
    required: false
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de filmes filtrados retornada com sucesso',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          title: { type: 'string', example: 'O Poderoso Chefão' },
          description: { type: 'string', example: 'Um clássico do cinema' },
          genre: { type: 'string', example: 'Drama' },
          year: { type: 'number', example: 1972 },
          rating: { type: 'number', example: 9.2 }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  findAllWithFilters(@Request() req, @Query() filterDto: MovieFilterDto): Promise<MovieListResponse[]> {
    const filtersWithUser = { ...filterDto, userId: req.user.userId };
    return this.movieService.findAllWithFilters(filtersWithUser);
  }

  @Get('filter/paginated')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Filtrar filmes com paginação',
    description: 'Retorna filmes do usuário com filtros e paginação aplicados'
  })
  @ApiQuery({ 
    name: 'page', 
    description: 'Número da página',
    example: 1,
    required: false
  })
  @ApiQuery({ 
    name: 'limit', 
    description: 'Quantidade de itens por página',
    example: 10,
    required: false
  })
  @ApiQuery({ 
    name: 'title', 
    description: 'Filtrar por título',
    required: false
  })
  @ApiQuery({ 
    name: 'genre', 
    description: 'Filtrar por gênero',
    required: false
  })
  @ApiQuery({ 
    name: 'year', 
    description: 'Filtrar por ano',
    required: false
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista paginada de filmes filtrados retornada com sucesso',
    schema: {
      example: {
        movies: [
          {
            id: 1,
            title: 'O Poderoso Chefão',
            description: 'Um clássico do cinema',
            genre: 'Drama',
            year: 1972,
            rating: 9.2
          }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  findAllWithFiltersPaginated(@Request() req, @Query() filterPaginatedDto: MovieFilterPaginatedDto): Promise<PaginatedMovieResponse> {
    const { page, limit, ...filters } = filterPaginatedDto;
    const filtersWithUser = { ...filters, userId: req.user.userId };
    return this.movieService.findAllWithFiltersPaginated(filtersWithUser, page, limit);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Buscar filme por ID',
    description: 'Retorna um filme específico do usuário autenticado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do filme',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Filme encontrado',
    schema: {
      example: {
        id: 1,
        title: 'O Poderoso Chefão',
        description: 'Um clássico do cinema',
        genre: 'Drama',
        year: 1972,
        rating: 9.2,
        userId: 1,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Filme não encontrado'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  findOne(@Request() req, @Param('id') id: string): Promise<FindMovieResponse> {
    return this.movieService.findOneByUser(req.user.userId, +id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Atualizar filme',
    description: 'Atualiza os dados de um filme específico do usuário autenticado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do filme',
    example: '1'
  })
  @ApiBody({ type: UpdateMovieDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Filme atualizado com sucesso',
    schema: {
      example: {
        message: 'Filme atualizado com sucesso',
        movie: {
          id: 1,
          title: 'O Poderoso Chefão Atualizado',
          description: 'Um clássico do cinema',
          genre: 'Drama',
          year: 1972,
          rating: 9.5,
          userId: 1,
          updatedAt: '2024-01-01T00:00:00.000Z'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Filme não encontrado'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  update(@Request() req, @Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto): Promise<UpdateMovieResponse> {
    return this.movieService.updateByUser(req.user.userId, +id, updateMovieDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Deletar filme',
    description: 'Remove um filme da lista do usuário autenticado'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'ID do filme',
    example: '1'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Filme deletado com sucesso',
    schema: {
      example: {
        message: 'Filme deletado com sucesso',
        id: 1
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Filme não encontrado'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  remove(@Request() req, @Param('id') id: string): Promise<MovieResponse> {
    return this.movieService.removeByUser(req.user.userId, +id);
  }
}
