import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Service } from '../../shared/services/s3.service';
import { PresignedUrlDto } from './dto/presigned-url.dto';

describe('UploadController', () => {
  let controller: UploadController;
  let s3Service: jest.Mocked<S3Service>;

  const mockRequest = {
    user: {
      userId: '1',
      email: 'test@example.com'
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: S3Service,
          useValue: {
            uploadFile: jest.fn(),
            getSignedUploadUrl: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    s3Service = module.get(S3Service);
  });

  it('deve estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('uploadImage', () => {
    const mockFile = {
      originalname: 'test-image.jpg',
      mimetype: 'image/jpeg',
      size: 1024 * 1024,
      buffer: Buffer.from('test file content'),
    };

    it('deve fazer upload de imagem com sucesso', async () => {
      const expectedUrl = 'https://bucket.s3.amazonaws.com/movies/1234567890-test-image.jpg';
      s3Service.uploadFile.mockResolvedValue(expectedUrl);

      const result = await controller.uploadImage(mockFile, mockRequest);

      expect(s3Service.uploadFile).toHaveBeenCalledWith(mockFile, 'movies');
      expect(result).toEqual({
        message: 'Imagem enviada com sucesso',
        imageUrl: expectedUrl,
        fileName: mockFile.originalname,
        size: mockFile.size,
        uploadedBy: '1'
      });
    });

    it('deve lançar BadRequestException quando nenhum arquivo é enviado', async () => {
      await expect(controller.uploadImage(null, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando tipo de arquivo não é permitido', async () => {
      const invalidFile = {
        ...mockFile,
        mimetype: 'application/pdf',
      };

      await expect(controller.uploadImage(invalidFile, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve aceitar tipos de imagem válidos', async () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const expectedUrl = 'https://bucket.s3.amazonaws.com/movies/test.jpg';
      s3Service.uploadFile.mockResolvedValue(expectedUrl);

      for (const type of validTypes) {
        const file = { ...mockFile, mimetype: type };
        await expect(controller.uploadImage(file, mockRequest)).resolves.not.toThrow();
      }
    });

    it('deve lançar BadRequestException quando arquivo é muito grande', async () => {
      const largeFile = {
        ...mockFile,
        size: 6 * 1024 * 1024,
      };

      await expect(controller.uploadImage(largeFile, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando erro no upload', async () => {
      s3Service.uploadFile.mockRejectedValue(new Error('S3 Error'));

      await expect(controller.uploadImage(mockFile, mockRequest)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getPresignedUrl', () => {
    const presignedUrlDto: PresignedUrlDto = {
      fileName: 'test-image.jpg',
      contentType: 'image/jpeg',
    };

    it('deve gerar URL pré-assinada com sucesso', async () => {
      const expectedUrl = 'https://signed-url.com';
      s3Service.getSignedUploadUrl.mockResolvedValue(expectedUrl);

      const result = await controller.getPresignedUrl(mockRequest, presignedUrlDto);

      expect(s3Service.getSignedUploadUrl).toHaveBeenCalledWith(
        presignedUrlDto.fileName,
        presignedUrlDto.contentType,
        'movies'
      );
      expect(result).toEqual({
        message: 'URL pré-assinada gerada com sucesso',
        presignedUrl: expectedUrl,
        fileName: presignedUrlDto.fileName,
        contentType: presignedUrlDto.contentType,
        expiresIn: 3600
      });
    });

    it('deve lançar BadRequestException quando fileName não é fornecido', async () => {
      const invalidDto = {
        ...presignedUrlDto,
        fileName: '',
      };

      await expect(controller.getPresignedUrl(mockRequest, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando contentType não é fornecido', async () => {
      const invalidDto = {
        ...presignedUrlDto,
        contentType: '',
      };

      await expect(controller.getPresignedUrl(mockRequest, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve lançar BadRequestException quando contentType não é permitido', async () => {
      const invalidDto = {
        ...presignedUrlDto,
        contentType: 'application/pdf',
      };

      await expect(controller.getPresignedUrl(mockRequest, invalidDto)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('deve aceitar tipos de conteúdo válidos', async () => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      const expectedUrl = 'https://signed-url.com';
      s3Service.getSignedUploadUrl.mockResolvedValue(expectedUrl);

      for (const type of validTypes) {
        const dto = { ...presignedUrlDto, contentType: type };
        await expect(controller.getPresignedUrl(mockRequest, dto)).resolves.not.toThrow();
      }
    });

    it('deve lançar BadRequestException quando erro ao gerar URL', async () => {
      s3Service.getSignedUploadUrl.mockRejectedValue(new Error('S3 Error'));

      await expect(controller.getPresignedUrl(mockRequest, presignedUrlDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
