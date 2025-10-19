import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockRegisterResponse = {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
    token: 'jwt-token',
  };

  const mockLoginResponse = {
    user: {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    },
    token: 'jwt-token',
  };

  const mockMessageResponse = {
    message: 'Operação realizada com sucesso',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve registrar usuário com sucesso', async () => {
      authService.register.mockResolvedValue(mockRegisterResponse);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockRegisterResponse);
    });

    it('deve chamar AuthService.register com dados corretos', async () => {
      authService.register.mockResolvedValue(mockRegisterResponse);

      await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('deve fazer login com sucesso', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
    });

    it('deve chamar AuthService.login com dados corretos', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  describe('forgotPassword', () => {
    const forgotPasswordDto: ForgotPasswordDto = {
      email: 'test@example.com',
    };

    it('deve processar solicitação de reset de senha', async () => {
      authService.forgotPassword.mockResolvedValue(mockMessageResponse);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith(forgotPasswordDto);
      expect(result).toEqual(mockMessageResponse);
    });

    it('deve chamar AuthService.forgotPassword com email correto', async () => {
      authService.forgotPassword.mockResolvedValue(mockMessageResponse);

      await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });
  });

  describe('resetPassword', () => {
    const resetPasswordDto: ResetPasswordDto = {
      token: 'reset-token',
      newPassword: 'newpassword123',
    };

    it('deve redefinir senha com sucesso', async () => {
      authService.resetPassword.mockResolvedValue(mockMessageResponse);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
      expect(result).toEqual(mockMessageResponse);
    });

    it('deve chamar AuthService.resetPassword com dados corretos', async () => {
      authService.resetPassword.mockResolvedValue(mockMessageResponse);

      await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith({
        token: 'reset-token',
        newPassword: 'newpassword123',
      });
    });
  });
});
