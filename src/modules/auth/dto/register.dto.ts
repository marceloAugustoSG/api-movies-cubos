import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para registro de novos usuários
 * 
 * Este DTO define a estrutura de dados necessária para criar
 * uma nova conta de usuário no sistema. Todos os campos são
 * obrigatórios e passam por validações específicas.
 */
export class RegisterDto {
  /**
   * Nome completo do usuário
   * 
   * Deve ser uma string com pelo menos 2 caracteres.
   * Será usado para identificação do usuário no sistema.
   */
  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2
  })
  @IsString()
  name: string;

  /**
   * Email do usuário
   * 
   * Deve ser um email válido e único no sistema.
   * Será usado para login e comunicação.
   */
  @ApiProperty({
    description: 'Email do usuário',
    example: 'joao@exemplo.com',
    format: 'email'
  })
  @IsEmail()
  email: string;

  /**
   * Senha do usuário
   * 
   * Deve ter pelo menos 6 caracteres.
   * Será criptografada antes de ser armazenada no banco.
   */
  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password: string;
}
