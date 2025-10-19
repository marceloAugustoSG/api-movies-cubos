import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieRepository } from '../../shared/repositories/movie.repository';
import { UserRepository } from '../../shared/repositories/user.repository';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MovieFilterDto } from './dto/movie-filter.dto';
import { ERROR_MESSAGES } from '../../shared/constants';

describe('MovieService', () => {
  let service: MovieService;
  let movieRepository: jest.Mocked<MovieRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
    resetPasswordToken: null,
    resetPasswordExpires: null,
    movies: []
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
    genres: 'Action,Drama',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    user: mockUser
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: MovieRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findManyPaginated: jest.fn(),
            findManyWithFilters: jest.fn(),
            findManyWithFiltersPaginated: jest.fn(),
            findById: jest.fn(),
            findByUserId: jest.fn(),
            findManyByUserIdPaginated: jest.fn(),
            findByIdAndUserId: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MovieService>(MovieService);
    movieRepository = module.get(MovieRepository);
    userRepository = module.get(UserRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
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

    it('deve criar um novo filme com sucesso', async () => {
      userRepository.findById.mockResolvedValue(mockUser);
      movieRepository.create.mockResolvedValue(mockMovie);

      const result = await service.create(createMovieDto);

      expect(userRepository.findById).toHaveBeenCalledWith(createMovieDto.userId);
      expect(movieRepository.create).toHaveBeenCalledWith({
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
        genres: 'Action,Drama',
        user: {
          connect: { id: createMovieDto.userId }
        }
      });
      expect(result).toEqual({
        id: mockMovie.id,
        title: mockMovie.title,
        originalTitle: mockMovie.originalTitle,
        description: mockMovie.description,
        releaseDate: mockMovie.releaseDate,
        duration: mockMovie.duration,
        budget: mockMovie.budget,
        revenue: mockMovie.revenue,
        profit: mockMovie.profit,
        imageUrl: mockMovie.imageUrl,
        slogan: mockMovie.slogan,
        trailerUrl: mockMovie.trailerUrl,
        rating: mockMovie.rating,
        voteCount: mockMovie.voteCount,
        ageRating: mockMovie.ageRating,
        status: mockMovie.status,
        language: mockMovie.language,
        genres: ['Action', 'Drama'],
        createdAt: mockMovie.createdAt,
        updatedAt: mockMovie.updatedAt,
        userId: mockMovie.userId,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });

    it('deve lançar NotFoundException quando usuário não existe', async () => {
      userRepository.findById.mockResolvedValue(null);

      await expect(service.create(createMovieDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(userRepository.findById).toHaveBeenCalledWith(createMovieDto.userId);
      expect(movieRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de filmes', async () => {
      const movies = [mockMovie, { ...mockMovie, id: 2, title: 'Another Movie' }];
      movieRepository.findMany.mockResolvedValue(movies);

      const result = await service.findAll();

      expect(movieRepository.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockMovie.id,
        title: mockMovie.title,
        originalTitle: mockMovie.originalTitle,
        description: mockMovie.description,
        releaseDate: mockMovie.releaseDate,
        duration: mockMovie.duration,
        budget: mockMovie.budget,
        revenue: mockMovie.revenue,
        profit: mockMovie.profit,
        imageUrl: mockMovie.imageUrl,
        slogan: mockMovie.slogan,
        trailerUrl: mockMovie.trailerUrl,
        rating: mockMovie.rating,
        voteCount: mockMovie.voteCount,
        ageRating: mockMovie.ageRating,
        status: mockMovie.status,
        language: mockMovie.language,
        genres: ['Action', 'Drama'],
        createdAt: mockMovie.createdAt,
        updatedAt: mockMovie.updatedAt,
        userId: mockMovie.userId,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });
  });

  describe('findByUserId', () => {
    it('deve retornar filmes de um usuário específico', async () => {
      const movies = [mockMovie];
      movieRepository.findByUserId.mockResolvedValue(movies);

      const result = await service.findByUserId('1');

      expect(movieRepository.findByUserId).toHaveBeenCalledWith('1');
      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('1');
    });
  });

  describe('findByUserIdPaginated', () => {
    it('deve retornar filmes paginados de um usuário', async () => {
      const movies = [mockMovie];
      const paginatedResult = {
        movies,
        total: 1,
        totalPages: 1
      };
      movieRepository.findManyByUserIdPaginated.mockResolvedValue(paginatedResult);

      const result = await service.findByUserIdPaginated('1', 1, 10);

      expect(movieRepository.findManyByUserIdPaginated).toHaveBeenCalledWith('1', 1, 10);
      expect(result).toEqual({
        movies: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      });
    });
  });

  describe('findOneByUser', () => {
    it('deve retornar filme de um usuário específico', async () => {
      movieRepository.findByIdAndUserId.mockResolvedValue(mockMovie);

      const result = await service.findOneByUser('1', 1);

      expect(movieRepository.findByIdAndUserId).toHaveBeenCalledWith(1, '1');
      expect(result).toEqual(expect.objectContaining({
        id: mockMovie.id,
        userId: '1'
      }));
    });

    it('deve lançar NotFoundException quando filme não é encontrado', async () => {
      movieRepository.findByIdAndUserId.mockResolvedValue(null);

      await expect(service.findOneByUser('1', 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateByUser', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
      genres: ['Comedy', 'Action'],
    };

    it('deve atualizar filme de um usuário', async () => {
      movieRepository.findByIdAndUserId.mockResolvedValue(mockMovie);
      movieRepository.update.mockResolvedValue({ ...mockMovie, ...updateMovieDto, releaseDate: mockMovie.releaseDate, genres: mockMovie.genres });

      const result = await service.updateByUser('1', 1, updateMovieDto);

      expect(movieRepository.findByIdAndUserId).toHaveBeenCalledWith(1, '1');
      expect(movieRepository.update).toHaveBeenCalledWith(1, {
        ...updateMovieDto,
        genres: 'Comedy,Action'
      });
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        userId: '1'
      }));
    });
  });

  describe('removeByUser', () => {
    it('deve remover filme de um usuário', async () => {
      movieRepository.findByIdAndUserId.mockResolvedValue(mockMovie);
      movieRepository.delete.mockResolvedValue(mockMovie);

      const result = await service.removeByUser('1', 1);

      expect(movieRepository.findByIdAndUserId).toHaveBeenCalledWith(1, '1');
      expect(movieRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(expect.objectContaining({
        id: 1,
        userId: '1'
      }));
    });
  });

  describe('findAllPaginated', () => {
    it('deve retornar filmes paginados', async () => {
      const movies = [mockMovie];
      const paginatedResult = {
        movies,
        total: 1,
        totalPages: 1
      };
      movieRepository.findManyPaginated.mockResolvedValue(paginatedResult);

      const result = await service.findAllPaginated(1, 10);

      expect(movieRepository.findManyPaginated).toHaveBeenCalledWith(1, 10);
      expect(result).toEqual({
        movies: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      });
    });
  });

  describe('findAllWithFilters', () => {
    it('deve retornar filmes com filtros', async () => {
      const filters: MovieFilterDto = {
        title: 'Test',
        minRating: 8.0,
      };
      const movies = [mockMovie];
      movieRepository.findManyWithFilters.mockResolvedValue(movies);

      const result = await service.findAllWithFilters(filters);

      expect(movieRepository.findManyWithFilters).toHaveBeenCalledWith(filters);
      expect(result).toEqual(expect.any(Array));
    });
  });

  describe('findAllWithFiltersPaginated', () => {
    it('deve retornar filmes paginados com filtros', async () => {
      const filters: MovieFilterDto = {
        title: 'Test',
        minRating: 8.0,
      };
      const movies = [mockMovie];
      const paginatedResult = {
        movies,
        total: 1,
        totalPages: 1
      };
      movieRepository.findManyWithFiltersPaginated.mockResolvedValue(paginatedResult);

      const result = await service.findAllWithFiltersPaginated(filters, 1, 10);

      expect(movieRepository.findManyWithFiltersPaginated).toHaveBeenCalledWith(filters, 1, 10);
      expect(result).toEqual({
        movies: expect.any(Array),
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1
        }
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar filme por ID', async () => {
      movieRepository.findById.mockResolvedValue(mockMovie);

      const result = await service.findOne(1);

      expect(movieRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(expect.objectContaining({
        id: 1
      }));
    });

    it('deve lançar NotFoundException quando filme não é encontrado', async () => {
      movieRepository.findById.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const updateMovieDto: UpdateMovieDto = {
      title: 'Updated Movie',
    };

    it('deve atualizar filme', async () => {
      movieRepository.findById.mockResolvedValue(mockMovie);
      movieRepository.update.mockResolvedValue({ ...mockMovie, ...updateMovieDto, releaseDate: mockMovie.releaseDate, genres: mockMovie.genres });

      const result = await service.update(1, updateMovieDto);

      expect(movieRepository.findById).toHaveBeenCalledWith(1);
      expect(movieRepository.update).toHaveBeenCalledWith(1, updateMovieDto);
      expect(result).toEqual(expect.objectContaining({
        id: 1
      }));
    });
  });

  describe('remove', () => {
    it('deve remover filme', async () => {
      movieRepository.findById.mockResolvedValue(mockMovie);
      movieRepository.delete.mockResolvedValue(mockMovie);

      const result = await service.remove(1);

      expect(movieRepository.findById).toHaveBeenCalledWith(1);
      expect(movieRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(expect.objectContaining({
        id: 1
      }));
    });
  });

  describe('mapMovieToResponse', () => {
    it('deve mapear filme para resposta corretamente', () => {
      const result = service['mapMovieToResponse'](mockMovie);

      expect(result).toEqual({
        id: mockMovie.id,
        title: mockMovie.title,
        originalTitle: mockMovie.originalTitle,
        description: mockMovie.description,
        releaseDate: mockMovie.releaseDate,
        duration: mockMovie.duration,
        budget: mockMovie.budget,
        revenue: mockMovie.revenue,
        profit: mockMovie.profit,
        imageUrl: mockMovie.imageUrl,
        slogan: mockMovie.slogan,
        trailerUrl: mockMovie.trailerUrl,
        rating: mockMovie.rating,
        voteCount: mockMovie.voteCount,
        ageRating: mockMovie.ageRating,
        status: mockMovie.status,
        language: mockMovie.language,
        genres: ['Action', 'Drama'],
        createdAt: mockMovie.createdAt,
        updatedAt: mockMovie.updatedAt,
        userId: mockMovie.userId,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email
        }
      });
    });

    it('deve lidar com filmes sem gêneros', () => {
      const movieWithoutGenres = { ...mockMovie, genres: null };
      const result = service['mapMovieToResponse'](movieWithoutGenres);

      expect(result.genres).toEqual([]);
    });

    it('deve lidar com filmes sem usuário', () => {
      const movieWithoutUser = { ...mockMovie, user: null };
      const result = service['mapMovieToResponse'](movieWithoutUser);

      expect(result.user).toBeUndefined();
    });
  });
});
