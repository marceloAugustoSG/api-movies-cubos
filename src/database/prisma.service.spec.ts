import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

const mockPrismaClient = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
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

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve conectar ao banco de dados', async () => {
    await service.$connect();

    expect(mockPrismaClient.$connect).toHaveBeenCalled();
  });

  it('deve desconectar do banco de dados', async () => {
    await service.$disconnect();

    expect(mockPrismaClient.$disconnect).toHaveBeenCalled();
  });
});