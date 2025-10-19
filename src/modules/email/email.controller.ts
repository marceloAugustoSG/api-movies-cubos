import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { EmailService } from '../../shared/services/email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('email')
@ApiBearerAuth('JWT-auth')
@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Enviar email personalizado',
    description: 'Envia um email personalizado para um destinatário'
  })
  @ApiBody({ type: SendEmailDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Email enviado com sucesso',
    schema: {
      example: {
        message: 'Email enviado com sucesso',
        to: 'usuario@exemplo.com',
        subject: 'Assunto do email'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Dados inválidos'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    await this.emailService.sendCustomEmail(
      sendEmailDto.to,
      sendEmailDto.subject,
      sendEmailDto.html,
      sendEmailDto.text
    );
    
    return {
      message: 'Email enviado com sucesso',
      to: sendEmailDto.to,
      subject: sendEmailDto.subject
    };
  }

  @Post('send-password-reset')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Enviar email de redefinição de senha',
    description: 'Envia um email com token para redefinição de senha'
  })
  @ApiBody({
    description: 'Email para redefinição de senha',
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
          description: 'Email do usuário',
          example: 'usuario@exemplo.com'
        }
      },
      required: ['email']
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Email de redefinição enviado com sucesso',
    schema: {
      example: {
        message: 'Email de redefinição de senha enviado com sucesso',
        email: 'usuario@exemplo.com'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Email inválido'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
  async sendPasswordResetEmail(@Body() body: { email: string }) {
    // Gerar token temporário para demonstração
    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    await this.emailService.sendPasswordResetEmail(body.email, resetToken);
    
    return {
      message: 'Email de redefinição de senha enviado com sucesso',
      email: body.email
    };
  }
}
