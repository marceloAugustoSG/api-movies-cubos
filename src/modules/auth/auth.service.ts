import { Injectable, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { UserRepository } from '../../shared/repositories/user.repository';
import { EmailService } from '../../shared/services/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { RegisterResponse, LoginResponse, ValidatedUser } from './types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) { }

  async register(registerDto: RegisterDto): Promise<RegisterResponse> {
    const { name, email, password } = registerDto;

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<ValidatedUser | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result as ValidatedUser;
    }
    return null;
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      // Por segurança, não revelamos se o email existe ou não
      return { message: 'Se o email existir, você receberá um link para redefinir sua senha' };
    }

    // Gerar token de reset
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hora

    // Salvar token no banco
    await this.userRepository.update(user.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetExpires,
    });

    // Enviar email
    await this.emailService.sendPasswordResetEmail(email, resetToken);

    return { message: 'Se o email existir, você receberá um link para redefinir sua senha' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const user = await this.userRepository.findByResetToken(token);
    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido ou expirado');
    }

    // Hash da nova senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha e limpar token
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    return { message: 'Senha redefinida com sucesso' };
  }
}
