import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    resetPasswordToken: null,
    resetPasswordExpires: null,
    movies: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve criar usuário com sucesso', async () => {
      userService.create.mockResolvedValue(mockUser);

      const result = await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('deve chamar UserService.create com dados corretos', async () => {
      userService.create.mockResolvedValue(mockUser);

      await controller.create(createUserDto);

      expect(userService.create).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [mockUser, { ...mockUser, id: '2', email: 'test2@example.com' }];
      userService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(userService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users);
    });

    it('deve retornar lista vazia quando não há usuários', async () => {
      userService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('deve retornar usuário por ID', async () => {
      userService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne('1');

      expect(userService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('deve retornar null quando usuário não encontrado', async () => {
      userService.findOne.mockResolvedValue(null);

      const result = await controller.findOne('999');

      expect(userService.findOne).toHaveBeenCalledWith('999');
      expect(result).toBeNull();
    });

    it('deve chamar UserService.findOne com ID correto', async () => {
      userService.findOne.mockResolvedValue(mockUser);

      await controller.findOne('1');

      expect(userService.findOne).toHaveBeenCalledWith('1');
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
      userService.update.mockResolvedValue(updatedUser);

      const result = await controller.update('1', updateUserDto);

      expect(userService.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('deve chamar UserService.update com parâmetros corretos', async () => {
      userService.update.mockResolvedValue(updatedUser);

      await controller.update('1', updateUserDto);

      expect(userService.update).toHaveBeenCalledWith('1', {
        name: 'Updated User',
        email: 'updated@example.com',
      });
    });
  });

  describe('remove', () => {
    it('deve remover usuário com sucesso', async () => {
      userService.remove.mockResolvedValue(mockUser);

      const result = await controller.remove('1');

      expect(userService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockUser);
    });

    it('deve chamar UserService.remove com ID correto', async () => {
      userService.remove.mockResolvedValue(mockUser);

      await controller.remove('1');

      expect(userService.remove).toHaveBeenCalledWith('1');
    });
  });
});
