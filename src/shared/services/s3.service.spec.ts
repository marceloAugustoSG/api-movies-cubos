import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
    process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
    process.env.AWS_REGION = 'us-east-1';
    process.env.AWS_S3_BUCKET_NAME = 'test-bucket';

    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('deve lançar erro quando credenciais AWS não estão configuradas', () => {
      delete process.env.AWS_ACCESS_KEY_ID;
      delete process.env.AWS_SECRET_ACCESS_KEY;
      
      expect(() => new S3Service()).toThrow(
        'Credenciais AWS não configuradas'
      );
    });

    it('deve usar valores padrão quando variáveis não estão definidas', () => {
      delete process.env.AWS_REGION;
      delete process.env.AWS_S3_BUCKET_NAME;
      
      expect(() => new S3Service()).not.toThrow();
    });

    it('deve inicializar com sucesso quando credenciais estão configuradas', () => {
      process.env.AWS_ACCESS_KEY_ID = 'test-access-key';
      process.env.AWS_SECRET_ACCESS_KEY = 'test-secret-key';
      
      expect(() => new S3Service()).not.toThrow();
    });
  });
});