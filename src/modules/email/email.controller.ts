import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { EmailService } from '../../shared/services/email.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SendEmailDto } from './dto/send-email.dto';

@Controller('email')
@UseGuards(JwtAuthGuard)
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
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
