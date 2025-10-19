import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from '../../shared/services/s3.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PresignedUrlDto } from './dto/presigned-url.dto';

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(@UploadedFile() file: any, @Request() req) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP');
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Arquivo muito grande. Máximo 5MB');
    }

    try {
      const imageUrl = await this.s3Service.uploadFile(file, 'movies');
      
      return {
        message: 'Imagem enviada com sucesso',
        imageUrl,
        fileName: file.originalname,
        size: file.size,
        uploadedBy: req.user.userId
      };
    } catch (error) {
      throw new BadRequestException('Erro ao fazer upload da imagem');
    }
  }

  @Post('presigned-url')
  @HttpCode(HttpStatus.OK)
  async getPresignedUrl(@Request() req, @Body() presignedUrlDto: PresignedUrlDto) {
    const { fileName, contentType } = presignedUrlDto;

    if (!fileName || !contentType) {
      throw new BadRequestException('fileName e contentType são obrigatórios');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(contentType)) {
      throw new BadRequestException('Tipo de arquivo não permitido');
    }

    try {
      const presignedUrl = await this.s3Service.getSignedUploadUrl(fileName, contentType, 'movies');
      
      return {
        message: 'URL pré-assinada gerada com sucesso',
        presignedUrl,
        fileName,
        contentType,
        expiresIn: 3600
      };
    } catch (error) {
      throw new BadRequestException('Erro ao gerar URL pré-assinada');
    }
  }
}
