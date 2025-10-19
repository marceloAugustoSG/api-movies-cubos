import { Test, TestingModule } from '@nestjs/testing';
import { EmailController } from './email.controller';
import { EmailService } from '../../shared/services/email.service';
import { SendEmailDto } from './dto/send-email.dto';

describe('EmailController', () => {
  let controller: EmailController;
  let emailService: jest.Mocked<EmailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailController],
      providers: [
        {
          provide: EmailService,
          useValue: {
            sendCustomEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
    emailService = module.get(EmailService);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('sendEmail', () => {
    const sendEmailDto: SendEmailDto = {
      to: 'test@example.com',
      subject: 'Test Subject',
      html: '<h1>Test HTML</h1>',
      text: 'Test text content',
    };

    it('deve enviar email customizado com sucesso', async () => {
      emailService.sendCustomEmail.mockResolvedValue(undefined);

      const result = await controller.sendEmail(sendEmailDto);

      expect(emailService.sendCustomEmail).toHaveBeenCalledWith(
        sendEmailDto.to,
        sendEmailDto.subject,
        sendEmailDto.html,
        sendEmailDto.text
      );
      expect(result).toEqual({
        message: 'Email enviado com sucesso',
        to: sendEmailDto.to,
        subject: sendEmailDto.subject
      });
    });

    it('deve enviar email apenas com HTML', async () => {
      const dtoWithOnlyHtml = {
        to: 'test@example.com',
        subject: 'Test Subject',
        html: '<h1>Test HTML</h1>',
      };
      emailService.sendCustomEmail.mockResolvedValue(undefined);

      const result = await controller.sendEmail(dtoWithOnlyHtml);

      expect(emailService.sendCustomEmail).toHaveBeenCalledWith(
        dtoWithOnlyHtml.to,
        dtoWithOnlyHtml.subject,
        dtoWithOnlyHtml.html,
        undefined
      );
      expect(result).toEqual({
        message: 'Email enviado com sucesso',
        to: dtoWithOnlyHtml.to,
        subject: dtoWithOnlyHtml.subject
      });
    });

    it('deve enviar email apenas com texto', async () => {
      const dtoWithOnlyText = {
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test text content',
      };
      emailService.sendCustomEmail.mockResolvedValue(undefined);

      const result = await controller.sendEmail(dtoWithOnlyText);

      expect(emailService.sendCustomEmail).toHaveBeenCalledWith(
        dtoWithOnlyText.to,
        dtoWithOnlyText.subject,
        undefined,
        dtoWithOnlyText.text
      );
      expect(result).toEqual({
        message: 'Email enviado com sucesso',
        to: dtoWithOnlyText.to,
        subject: dtoWithOnlyText.subject
      });
    });

    it('deve enviar email sem HTML nem texto', async () => {
      const dtoMinimal = {
        to: 'test@example.com',
        subject: 'Test Subject',
      };
      emailService.sendCustomEmail.mockResolvedValue(undefined);

      const result = await controller.sendEmail(dtoMinimal);

      expect(emailService.sendCustomEmail).toHaveBeenCalledWith(
        dtoMinimal.to,
        dtoMinimal.subject,
        undefined,
        undefined
      );
      expect(result).toEqual({
        message: 'Email enviado com sucesso',
        to: dtoMinimal.to,
        subject: dtoMinimal.subject
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    const body = {
      email: 'test@example.com',
    };

    it('deve enviar email de reset de senha com sucesso', async () => {
      emailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result = await controller.sendPasswordResetEmail(body);

      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        body.email,
        expect.any(String)
      );
      expect(result).toEqual({
        message: 'Email de redefinição de senha enviado com sucesso',
        email: body.email
      });
    });

    it('deve gerar token único para cada requisição', async () => {
      emailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      const result1 = await controller.sendPasswordResetEmail(body);
      const result2 = await controller.sendPasswordResetEmail(body);

      const calls = emailService.sendPasswordResetEmail.mock.calls;
      expect(calls[0][1]).not.toBe(calls[1][1]);
    });

    it('deve gerar token com formato correto', async () => {
      emailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await controller.sendPasswordResetEmail(body);

      const calls = emailService.sendPasswordResetEmail.mock.calls;
      const token = calls[0][1];

      expect(typeof token).toBe('string');
      expect(token.length).toBeGreaterThan(0);
      expect(/^[a-z0-9]+$/i.test(token)).toBe(true);
    });

    it('deve chamar serviço de email com parâmetros corretos', async () => {
      emailService.sendPasswordResetEmail.mockResolvedValue(undefined);

      await controller.sendPasswordResetEmail(body);

      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
      expect(emailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        body.email,
        expect.any(String)
      );
    });
  });
});
