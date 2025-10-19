import { IsString, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO para envio de emails personalizados
 * 
 * Este DTO define a estrutura de dados necessária para enviar
 * emails personalizados através da API. Permite definir destinatário,
 * assunto e conteúdo tanto em HTML quanto em texto simples.
 */
export class SendEmailDto {
  /**
   * Email do destinatário
   * 
   * Endereço de email válido para onde a mensagem será enviada.
   * Deve ser um email válido e acessível.
   */
  @ApiProperty({
    description: 'Email do destinatário',
    example: 'usuario@exemplo.com',
    format: 'email'
  })
  @IsEmail()
  to: string;

  /**
   * Assunto do email
   * 
   * Título da mensagem que aparecerá na caixa de entrada
   * do destinatário. Deve ser descritivo e claro.
   */
  @ApiProperty({
    description: 'Assunto do email',
    example: 'Bem-vindo à API Movie Cubos'
  })
  @IsString()
  subject: string;

  /**
   * Conteúdo HTML do email
   * 
   * Versão HTML da mensagem. Permite formatação rica
   * com cores, imagens, links e estilos CSS.
   */
  @ApiPropertyOptional({
    description: 'Conteúdo HTML do email',
    example: '<h1>Olá!</h1><p>Este é um email de teste.</p>'
  })
  @IsOptional()
  @IsString()
  html?: string;

  /**
   * Conteúdo em texto simples do email
   * 
   * Versão em texto simples da mensagem. Usado como
   * fallback para clientes que não suportam HTML.
   */
  @ApiPropertyOptional({
    description: 'Conteúdo em texto do email',
    example: 'Olá! Este é um email de teste.'
  })
  @IsOptional()
  @IsString()
  text?: string;
}
