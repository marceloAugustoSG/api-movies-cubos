import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { UserRepository } from '../../shared/repositories/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: {
            create: jest.fn(),
            findMany: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve criar um novo usuário com sucesso', async () => {
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: expect.any(String),
      });
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetPasswordToken: mockUser.resetPasswordToken,
        resetPasswordExpires: mockUser.resetPasswordExpires,
        movies: mockUser.movies,
      });
    });

    it('deve hash da senha antes de criar usuário', async () => {
      userRepository.create.mockResolvedValue(mockUser);
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      await service.create(createUserDto);

      expect(hashSpy).toHaveBeenCalledWith(createUserDto.password, 10);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [mockUser, { ...mockUser, id: '2', email: 'test2@example.com' }];
      userRepository.findMany.mockResolvedValue(users);

      const result = await service.findAll();

      expect(userRepository.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetPasswordToken: mockUser.resetPasswordToken,
        resetPasswordExpires: mockUser.resetPasswordExpires,
        movies: mockUser.movies,
      });
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      userRepository.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário quando encontrado', async () => {
      userRepository.findById.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(userRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetPasswordToken: mockUser.resetPasswordToken,
        resetPasswordExpires: mockUser.resetPasswordExpires,
        movies: mockUser.movies,
      });
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      userRepository.findById.mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(userRepository.findById).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com',
    };

    const updatedUser = {
      ...mockUser,
      name: 'Updated User',
      email: 'updated@example.com',
    };

    it('deve atualizar usuário com sucesso', async () => {
      userRepository.update.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(userRepository.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
        resetPasswordToken: updatedUser.resetPasswordToken,
        resetPasswordExpires: updatedUser.resetPasswordExpires,
        movies: updatedUser.movies,
      });
    });

    it('deve hash da senha quando senha é fornecida', async () => {
      const updateWithPassword: UpdateUserDto = {
        ...updateUserDto,
        password: 'newpassword123',
      };
      userRepository.update.mockResolvedValue(updatedUser);
      const hashSpy = jest.spyOn(bcrypt, 'hash');

      await service.update('1', updateWithPassword);

      expect(hashSpy).toHaveBeenCalledWith('newpassword123', 10);
      expect(userRepository.update).toHaveBeenCalledWith('1', {
        ...updateWithPassword,
        password: expect.any(String),
      });
    });
  });

  describe('remove', () => {
    it('deve remover usuário com sucesso', async () => {
      userRepository.delete.mockResolvedValue(mockUser);

      const result = await service.remove('1');

      expect(userRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetPasswordToken: mockUser.resetPasswordToken,
        resetPasswordExpires: mockUser.resetPasswordExpires,
        movies: mockUser.movies,
      });
    });
  });

  describe('mapUserToResponse', () => {
    it('deve remover senha da resposta', () => {
      const userWithPassword = {
        ...mockUser,
        password: 'hashedPassword',
      };

      const result = service['mapUserToResponse'](userWithPassword);

      expect(result).not.toHaveProperty('password');
      expect(result).toEqual({
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        createdAt: mockUser.createdAt,
        updatedAt: mockUser.updatedAt,
        resetPasswordToken: mockUser.resetPasswordToken,
        resetPasswordExpires: mockUser.resetPasswordExpires,
        movies: mockUser.movies,
      });
    });
  });
});
