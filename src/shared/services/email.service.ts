import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY não encontrada nas variáveis de ambiente');
    }
    this.resend = new Resend(apiKey);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    try {
      await this.resend.emails.send({
        from: 'onboarding@resend.dev',
        to: [email],
        subject: 'Redefinir sua senha - API de Filmes',
        html: this.getPasswordResetTemplate(resetUrl),
      });
    } catch (error) {
      throw new Error('Falha ao enviar email de redefinição de senha');
    }
  }

  async sendCustomEmail(to: string, subject: string, html?: string, text?: string): Promise<void> {
    try {
      const emailData: any = {
        from: 'onboarding@resend.dev',
        to: [to],
        subject,
      };

      if (html) {
        emailData.html = html;
      }
      if (text) {
        emailData.text = text;
      }

      await this.resend.emails.send(emailData);
    } catch (error) {
      throw new Error('Falha ao enviar email');
    }
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Redefinir Senha</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎬 API de Filmes</h1>
            </div>
            <div class="content">
              <h2>Redefinir sua senha</h2>
              <p>Olá!</p>
              <p>Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:</p>
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
              <p>Se você não solicitou esta redefinição, ignore este email.</p>
              <p><strong>Este link expira em 1 hora.</strong></p>
            </div>
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}
