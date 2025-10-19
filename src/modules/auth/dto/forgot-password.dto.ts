import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    description: 'Email do usuário para redefinição de senha',
    example: 'joao@exemplo.com',
    format: 'email'
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token de redefinição recebido por email',
    example: 'abc123def456ghi789'
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'novaSenha123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
