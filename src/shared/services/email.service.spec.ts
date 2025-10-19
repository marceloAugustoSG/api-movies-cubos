import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    process.env.RESEND_API_KEY = 'test-api-key';
    process.env.FRONTEND_URL = 'http://localhost:3000';

    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('deve lançar erro quando RESEND_API_KEY não está definida', () => {
      delete process.env.RESEND_API_KEY;
      
      expect(() => new EmailService()).toThrow(
        'RESEND_API_KEY não encontrada nas variáveis de ambiente'
      );
    });

    it('deve inicializar com sucesso quando RESEND_API_KEY está definida', () => {
      process.env.RESEND_API_KEY = 'test-api-key';
      
      expect(() => new EmailService()).not.toThrow();
    });
  });

  describe('getPasswordResetTemplate', () => {
    it('deve gerar template HTML válido', () => {
      const resetUrl = 'http://localhost:3000/reset-password?token=test-token';
      
      const template = service['getPasswordResetTemplate'](resetUrl);

      expect(template).toContain('<!DOCTYPE html>');
      expect(template).toContain('<html>');
      expect(template).toContain('Redefinir sua senha');
      expect(template).toContain(resetUrl);
      expect(template).toContain('Este link expira em 1 hora');
    });

    it('deve incluir estilos CSS no template', () => {
      const resetUrl = 'http://localhost:3000/reset-password?token=test-token';
      
      const template = service['getPasswordResetTemplate'](resetUrl);

      expect(template).toContain('<style>');
      expect(template).toContain('font-family: Arial, sans-serif');
      expect(template).toContain('.button');
      expect(template).toContain('background: #007bff');
    });
  });
});