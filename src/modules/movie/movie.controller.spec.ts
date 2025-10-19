import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { PaginationDto } from './dto/pagination.dto';
import { MovieFilterDto } from './dto/movie-filter.dto';
import { MovieFilterPaginatedDto } from './dto/movie-filter-paginated.dto';

describe('MovieController', () => {
  let controller: MovieController;
  let movieService: jest.Mocked<MovieService>;

  const mockRequest = {
    user: {
      userId: '1',
      email: 'test@example.com'
    }
  };

  const mockMovie = {
    id: 1,
    title: 'Test Movie',
    originalTitle: 'Test Movie Original',
    description: 'A test movie',
    releaseDate: new Date('2023-01-01'),
    duration: 120,
    budget: 1000000,
    revenue: 2000000,
    profit: 1000000,
    imageUrl: 'https://example.com/image.jpg',
    slogan: 'Test slogan',
    trailerUrl: 'https://example.com/trailer.mp4',
    rating: 8.5,
    voteCount: 1000,
    ageRating: 'PG-13',
    status: 'RELEASED',
    language: 'en',
    genres: ['Action', 'Drama'],
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            findByUserId: jest.fn(),
            findByUserIdPaginated: jest.fn(),
            findAllWithFilters: jest.fn(),
            findAllWithFiltersPaginated: jest.fn(),
            findOneByUser: jest.fn(),
            updateByUser: jest.fn(),
            removeByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<MovieController>(MovieController);
    movieService = module.get(MovieService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
  const createMovieDto: CreateMovieDto = {
    title: 'Test Movie',
    originalTitle: 'Test Movie Original',
    description: 'A test movie',
    releaseDate: '2023-01-01',
    duration: 120,
    budget: 1000000,
    revenue: 2000000,
    profit: 1000000,
    imageUrl: 'https://example.com/image.jpg',
    slogan: 'Test slogan',
    trailerUrl: 'https://example.com/trailer.mp4',
    rating: 8.5,
    voteCount: 1000,
    ageRating: 'PG-13',
    status: 'RELEASED',
    language: 'en',
    genres: ['Action', 'Drama'],
    userId: '1',
  };

    it('deve criar filme com sucesso', async () => {
      movieService.create.mockResolvedValue(mockMovie);

      const result = await controller.create(mockRequest, createMovieDto);

      expect(movieService.create).toHaveBeenCalledWith({
        ...createMovieDto,
        userId: '1'
      });
      expect(result).toEqual(mockMovie);
    });

    it('deve incluir userId do usuário autenticado', async () => {
      movieService.create.mockResolvedValue(mockMovie);

      await controller.create(mockRequest, createMovieDto);

      expect(movieService.create).toHaveBeenCalledWith({
        ...createMovieDto,
        userId: '1'
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar filmes do usuário', async () => {
      const movies = [mockMovie];
      movieService.findByUserId.mockResolvedValue(movies);

      const result = await controller.findAll(mockRequest);

      expect(movieService.findByUserId).toHaveBeenCalledWith('1');
      expect(result).toEqual(movies);
    });

    it('deve chamar MovieService.findByUserId com userId correto', async () => {
      movieService.findByUserId.mockResolvedValue([]);

      await controller.findAll(mockRequest);

      expect(movieService.findByUserId).toHaveBeenCalledWith('1');
    });
  });

  describe('findAllPaginated', () => {
    const paginationDto: PaginationDto = {
      page: 1,
      limit: 10,
    };

    it('deve retornar filmes paginados do usuário', async () => {
      const paginatedResult = {
        movies: [mockMovie],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };
      movieService.findByUserIdPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllPaginated(mockRequest, paginationDto);

      expect(movieService.findByUserIdPaginated).toHaveBeenCalledWith('1', 1, 10);
      expect(result).toEqual(paginatedResult);
    });

    it('deve chamar MovieService.findByUserIdPaginated com parâmetros corretos', async () => {
      movieService.findByUserIdPaginated.mockResolvedValue({
        movies: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      });

      await controller.findAllPaginated(mockRequest, paginationDto);

      expect(movieService.findByUserIdPaginated).toHaveBeenCalledWith('1', 1, 10);
    });
  });

  describe('findAllWithFilters', () => {
    const filterDto: MovieFilterDto = {
      title: 'Test',
      minRating: 8.0,
    };

    it('deve retornar filmes filtrados do usuário', async () => {
      const movies = [mockMovie];
      movieService.findAllWithFilters.mockResolvedValue(movies);

      const result = await controller.findAllWithFilters(mockRequest, filterDto);

      expect(movieService.findAllWithFilters).toHaveBeenCalledWith({
        ...filterDto,
        userId: '1'
      });
      expect(result).toEqual(movies);
    });

    it('deve incluir userId nos filtros', async () => {
      movieService.findAllWithFilters.mockResolvedValue([]);

      await controller.findAllWithFilters(mockRequest, filterDto);

      expect(movieService.findAllWithFilters).toHaveBeenCalledWith({
        title: 'Test',
        minRating: 8.0,
        userId: '1'
      });
    });
  });

  describe('findAllWithFiltersPaginated', () => {
    const filterPaginatedDto: MovieFilterPaginatedDto = {
      page: 1,
      limit: 10,
      title: 'Test',
      minRating: 8.0,
    };

    it('deve retornar filmes filtrados e paginados do usuário', async () => {
      const paginatedResult = {
        movies: [mockMovie],
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      };
      movieService.findAllWithFiltersPaginated.mockResolvedValue(paginatedResult);

      const result = await controller.findAllWithFiltersPaginated(mockRequest, filterPaginatedDto);

      expect(movieService.findAllWithFiltersPaginated).toHaveBeenCalledWith(
        { title: 'Test', minRating: 8.0, userId: '1' },
        1,
        10
      );
      expect(result).toEqual(paginatedResult);
    });

    it('deve separar parâmetros de paginação dos filtros', async () => {
      movieService.findAllWithFiltersPaginated.mockResolvedValue({
        movies: [],
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 }
      });

      await controller.findAllWithFiltersPaginated(mockRequest, filterPaginatedDto);

      expect(movieService.findAllWithFiltersPaginated).toHaveBeenCalledWith(
        { title: 'Test', minRating: 8.0, userId: '1' },
        1,
        10
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar filme específico do usuário', async () => {
      movieService.findOneByUser.mockResolvedValue(mockMovie);

      const result = await controller.findOne(mockRequest, '1');

      expect(movieService.findOneByUser).toHaveBeenCalledWith('1', 1);
      expect(result).toEqual(mockMovie);
    });

    it('deve converter ID string para número', async () => {
      movieService.findOneByUser.mockResolvedValue(mockMovie);

      await controller.findOne(mockRequest, '123');

      expect(movieService.findOneByUser).toHaveBeenCalledWith('1', 123);
    });
  });

  describe('update', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
      genres: ['Comedy', 'Action'],
    };

    it('deve atualizar filme do usuário', async () => {
      const updatedMovie = { ...mockMovie, ...updateMovieDto, releaseDate: mockMovie.releaseDate };
      movieService.updateByUser.mockResolvedValue(updatedMovie);

      const result = await controller.update(mockRequest, '1', updateMovieDto);

      expect(movieService.updateByUser).toHaveBeenCalledWith('1', 1, updateMovieDto);
      expect(result).toEqual(updatedMovie);
    });

    it('deve converter ID string para número', async () => {
      movieService.updateByUser.mockResolvedValue(mockMovie);

      await controller.update(mockRequest, '123', updateMovieDto);

      expect(movieService.updateByUser).toHaveBeenCalledWith('1', 123, updateMovieDto);
    });
  });

  describe('remove', () => {
    it('deve remover filme do usuário', async () => {
      movieService.removeByUser.mockResolvedValue(mockMovie);

      const result = await controller.remove(mockRequest, '1');

      expect(movieService.removeByUser).toHaveBeenCalledWith('1', 1);
      expect(result).toEqual(mockMovie);
    });

    it('deve converter ID string para número', async () => {
      movieService.removeByUser.mockResolvedValue(mockMovie);

      await controller.remove(mockRequest, '123');

      expect(movieService.removeByUser).toHaveBeenCalledWith('1', 123);
    });
  });
});
