import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { AuthService } from './auth.service';
import { UserRepository } from '../../shared/repositories/user.repository';
import { EmailService } from '../../shared/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: jest.Mocked<UserRepository>;
  let jwtService: jest.Mocked<JwtService>;
  let emailService: jest.Mocked<EmailService>;

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
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            findByResetToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendPasswordResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(UserRepository);
    jwtService = module.get(JwtService);
    emailService = module.get(EmailService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve registrar um novo usuário com sucesso', async () => {
      userRepository.findByEmail.mockResolvedValue(null);
      userRepository.create.mockResolvedValue(mockUser);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register(registerDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userRepository.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: expect.any(String),
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        token: 'jwt-token',
      });
    });

    it('deve lançar ConflictException quando email já existe', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(userRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve fazer login com sucesso', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login(loginDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
        token: 'jwt-token',
      });
    });

    it('deve lançar UnauthorizedException quando usuário não existe', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(userRepository.findByEmail).toHaveBeenCalledWith(loginDto.email);
    });

    it('deve lançar UnauthorizedException quando senha está incorreta', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });
  });

  describe('validateUser', () => {
    it('deve validar usuário com credenciais corretas', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await service.validateUser('test@example.com', 'password123');

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

    it('deve retornar null quando usuário não existe', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('test@example.com', 'password123');

      expect(result).toBeNull();
    });

    it('deve retornar null quando senha está incorreta', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('deve enviar email de reset quando usuário existe', async () => {
      userRepository.findByEmail.mockResolvedValue(mockUser);
      userRepository.update.mockResolvedValue(mockUser);
      emailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(userRepository.update).toHaveBeenCalledWith(mockUser.id, {
        resetPasswordToken: expect.any(String),
        resetPasswordExpires: expect.any(Date),
      });
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        forgotPasswordDto.email,
        expect.any(String),
      );
      expect(result).toEqual({
        message: 'Se o email existir, você receberá um link para redefinir sua senha',
      });
    });

    it('deve retornar mensagem mesmo quando usuário não existe', async () => {
      userRepository.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword(forgotPasswordDto);

      expect(userRepository.findByEmail).toHaveBeenCalledWith(forgotPasswordDto.email);
      expect(userRepository.update).not.toHaveBeenCalled();
      expect(emailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result).toEqual({
        message: 'Se o email existir, você receberá um link para redefinir sua senha',
      });
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'valid-token',
      newPassword: 'newpassword123',
    };

    const userWithToken = {
      ...mockUser,
      resetPasswordToken: 'valid-token',
      resetPasswordExpires: new Date(Date.now() + 3600000),
    };

    it('deve redefinir senha com sucesso', async () => {
      userRepository.findByResetToken.mockResolvedValue(userWithToken);
      userRepository.update.mockResolvedValue(userWithToken);

      const result = await service.resetPassword(resetPasswordDto);

      expect(userRepository.findByResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
      expect(userRepository.update).toHaveBeenCalledWith(userWithToken.id, {
        password: expect.any(String),
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });
      expect(result).toEqual({
        message: 'Senha redefinida com sucesso',
      });
    });

    it('deve lançar BadRequestException quando token é inválido', async () => {
      userRepository.findByResetToken.mockResolvedValue(null);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(userRepository.findByResetToken).toHaveBeenCalledWith(resetPasswordDto.token);
    });

    it('deve lançar BadRequestException quando token está expirado', async () => {
      const expiredUser = {
        ...userWithToken,
        resetPasswordExpires: new Date(Date.now() - 3600000),
      };
      userRepository.findByResetToken.mockResolvedValue(expiredUser);

      await expect(service.resetPassword(resetPasswordDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
