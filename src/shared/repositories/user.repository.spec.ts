import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../database/prisma.service';
import { ERROR_MESSAGES } from '../constants';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

describe('UserRepository', () => {
  let repository: UserRepository;
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

  beforeEach(async () => {
    jest.clearAllMocks();
 
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get<PrismaService>(PrismaService);
 
    mockPrismaService.user.create.mockResolvedValue(mockUser);
    mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
    mockPrismaService.user.findFirst.mockResolvedValue(mockUser);
    mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
    mockPrismaService.user.update.mockResolvedValue(mockUser);
    mockPrismaService.user.delete.mockResolvedValue(mockUser);
  });

  it('deve estar definido', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    it('deve criar usuário com sucesso', async () => {
      prismaService.user.findUnique.mockResolvedValueOnce(null);

      const result = await repository.create(createData);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createData.email },
        include: { movies: true }
      });
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: createData
      });
      expect(result).toEqual(mockUser);
    });

    it('deve lançar BadRequestException quando email já existe', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(repository.create(createData)).rejects.toThrow(
        BadRequestException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createData.email },
        include: { movies: true }
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('deve retornar usuário por ID', async () => {
      const result = await repository.findById('1');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { movies: true }
      });
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('deve retornar usuário por email', async () => {
      const result = await repository.findByEmail('test@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        include: { movies: true }
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('findByResetToken', () => {
    it('deve retornar usuário por token de reset válido', async () => {
      const userWithToken = {
        ...mockUser,
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: new Date(Date.now() + 3600000),
      };
      prismaService.user.findFirst.mockResolvedValue(userWithToken);

      const result = await repository.findByResetToken('valid-token');

      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: {
          resetPasswordToken: 'valid-token',
          resetPasswordExpires: {
            gt: expect.any(Date)
          }
        },
        include: { movies: true }
      });
      expect(result).toEqual(userWithToken);
    });
  });

  describe('findMany', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [mockUser];
      const result = await repository.findMany();

      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        include: { movies: true },
        orderBy: { createdAt: 'desc' }
      });
      expect(result).toEqual(users);
    });
  });

  describe('update', () => {
    const updateData = {
      name: 'Updated User',
    };

    it('deve atualizar usuário', async () => {
      const updatedUser = { ...mockUser, ...updateData };
      prismaService.user.update.mockResolvedValue(updatedUser);

      const result = await repository.update('1', updateData);

      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateData,
        include: { movies: true }
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('deve deletar usuário', async () => {
      const result = await repository.delete('1');

      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: '1' }
      });
      expect(result).toEqual(mockUser);
    });
  });
});