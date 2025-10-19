import { Test, TestingModule } from '@nestjs/testing';
import { MovieRepository } from './movie.repository';
import { PrismaService } from '../../database/prisma.service';
import { MovieFilterDto } from '../../modules/movie/dto/movie-filter.dto';

const mockPrismaService = {
  movie: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('MovieRepository', () => {
  let repository: MovieRepository;
  let prismaService: any;

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
        MovieRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<MovieRepository>(MovieRepository);
    prismaService = module.get<PrismaService>(PrismaService);

    mockPrismaService.movie.create.mockResolvedValue(mockMovie);
    mockPrismaService.movie.findUnique.mockResolvedValue(mockMovie);
    mockPrismaService.movie.findFirst.mockResolvedValue(mockMovie);
    mockPrismaService.movie.findMany.mockResolvedValue([mockMovie]);
    mockPrismaService.movie.count.mockResolvedValue(1);
    mockPrismaService.movie.update.mockResolvedValue(mockMovie);
    mockPrismaService.movie.delete.mockResolvedValue(mockMovie);
  });

  it('deve estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createData = {
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
      user: {
        connect: { id: '1' }
      }
    };

    it('deve criar filme com sucesso', async () => {
      const result = await repository.create(createData);

      expect(prismaService.movie.create).toHaveBeenCalledWith({
        data: createData,
        include: { user: true }
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('findById', () => {
    it('deve retornar filme por ID', async () => {
      const result = await repository.findById(1);

      expect(prismaService.movie.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { user: true }
      });
      expect(result).toEqual(mockMovie);
    });

    it('deve retornar null quando filme não encontrado', async () => {
      prismaService.movie.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findMany', () => {
    it('deve retornar lista de filmes', async () => {
      const movies = [mockMovie];
      const result = await repository.findMany();

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(movies);
    });
  });

  describe('findManyPaginated', () => {
    it('deve retornar filmes paginados', async () => {
      const movies = [mockMovie];
      const result = await repository.findManyPaginated(1, 10);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
      expect(prismaService.movie.count).toHaveBeenCalled();
      expect(result).toEqual({
        movies,
        total: 1,
        totalPages: 1
      });
    });
  });

  describe('findManyWithFilters', () => {
    it('deve retornar filmes com filtros', async () => {
      const filters: MovieFilterDto = {
        title: 'Test',
        minRating: 8.0,
      };
      const movies = [mockMovie];
      const result = await repository.findManyWithFilters(filters);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          title: { contains: 'Test' },
          rating: { gte: 8.0 }
        }),
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(movies);
    });
  });

  describe('findManyWithFiltersPaginated', () => {
    it('deve retornar filmes paginados com filtros', async () => {
      const filters: MovieFilterDto = {
        title: 'Test',
      };
      const movies = [mockMovie];
      const result = await repository.findManyWithFiltersPaginated(filters, 1, 10);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        where: expect.objectContaining({
          title: { contains: 'Test' }
        }),
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
      expect(prismaService.movie.count).toHaveBeenCalledWith({
        where: expect.objectContaining({
          title: { contains: 'Test' }
        })
      });
      expect(result).toEqual({
        movies,
        total: 1,
        totalPages: 1
      });
    });
  });

  describe('findByUserId', () => {
    it('deve retornar filmes de um usuário', async () => {
      const movies = [mockMovie];
      const result = await repository.findByUserId('1');

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        include: { user: true },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(movies);
    });
  });

  describe('findManyByUserIdPaginated', () => {
    it('deve retornar filmes paginados de um usuário', async () => {
      const movies = [mockMovie];
      const result = await repository.findManyByUserIdPaginated('1', 1, 10);

      expect(prismaService.movie.findMany).toHaveBeenCalledWith({
        where: { userId: '1' },
        include: { user: true },
        orderBy: { createdAt: 'desc' },
        skip: 0,
        take: 10
      });
      expect(prismaService.movie.count).toHaveBeenCalledWith({
        where: { userId: '1' }
      });
      expect(result).toEqual({
        movies,
        total: 1,
        totalPages: 1
      });
    });
  });

  describe('findByIdAndUserId', () => {
    it('deve retornar filme por ID e userId', async () => {
      const result = await repository.findByIdAndUserId(1, '1');

      expect(prismaService.movie.findFirst).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: '1'
        },
        include: { user: true }
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('update', () => {
    const updateData = {
      title: 'Updated Movie',
    };

    it('deve atualizar filme', async () => {
      const updatedMovie = { ...mockMovie, ...updateData };
      prismaService.movie.update.mockResolvedValue(updatedMovie);

      const result = await repository.update(1, updateData);

      expect(prismaService.movie.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateData,
        include: { user: true }
      });
      expect(result).toEqual(updatedMovie);
    });
  });

  describe('delete', () => {
    it('deve deletar filme', async () => {
      const result = await repository.delete(1);

      expect(prismaService.movie.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
      expect(result).toEqual(mockMovie);
    });
  });

  describe('buildWhereClause', () => {
    it('deve construir cláusula WHERE com filtros de título', () => {
      const filters: MovieFilterDto = {
        title: 'Test Movie',
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        title: { contains: 'Test Movie' }
      });
    });

    it('deve construir cláusula WHERE com filtros de ano de lançamento', () => {
      const filters: MovieFilterDto = {
        releaseYear: 2023,
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        releaseDate: {
          gte: new Date(2023, 0, 1),
          lte: new Date(2023, 11, 31, 23, 59, 59)
        }
      });
    });

    it('deve construir cláusula WHERE com filtros de duração', () => {
      const filters: MovieFilterDto = {
        minDuration: 90,
        maxDuration: 150,
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        duration: {
          gte: 90,
          lte: 150
        }
      });
    });

    it('deve construir cláusula WHERE com filtros de orçamento', () => {
      const filters: MovieFilterDto = {
        minBudget: 1000000,
        maxBudget: 5000000,
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        budget: {
          gte: 1000000,
          lte: 5000000
        }
      });
    });

    it('deve construir cláusula WHERE com filtros de rating', () => {
      const filters: MovieFilterDto = {
        minRating: 7.0,
        maxRating: 9.0,
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        rating: {
          gte: 7.0,
          lte: 9.0
        }
      });
    });

    it('deve construir cláusula WHERE com filtros de gênero', () => {
      const filters: MovieFilterDto = {
        genres: 'Action',
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        genres: { contains: 'Action' }
      });
    });

    it('deve construir cláusula WHERE com múltiplos filtros', () => {
      const filters: MovieFilterDto = {
        title: 'Test',
        minRating: 8.0,
        userId: '1',
        genres: 'Action',
      };

      const whereClause = repository['buildWhereClause'](filters);

      expect(whereClause).toEqual({
        title: { contains: 'Test' },
        rating: { gte: 8.0 },
        userId: '1',
        genres: { contains: 'Action' }
      });
    });
  });
});