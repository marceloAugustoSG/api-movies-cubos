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
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { S3Service } from '../../shared/services/s3.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PresignedUrlDto } from './dto/presigned-url.dto';

@ApiTags('upload')
@ApiBearerAuth('JWT-auth')
@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('image')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ 
    summary: 'Upload de imagem',
    description: 'Faz upload de uma imagem para o S3'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de imagem',
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Arquivo de imagem (JPEG, PNG, GIF, WebP) - máximo 5MB'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Imagem enviada com sucesso',
    schema: {
      example: {
        message: 'Imagem enviada com sucesso',
        imageUrl: 'https://bucket.s3.amazonaws.com/movies/image.jpg',
        fileName: 'image.jpg',
        size: 1024000,
        uploadedBy: 1
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Arquivo inválido ou muito grande'
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Token JWT inválido ou expirado'
  })
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
  @ApiOperation({ 
    summary: 'Gerar URL pré-assinada',
    description: 'Gera uma URL pré-assinada para upload direto ao S3'
  })
  @ApiBody({ type: PresignedUrlDto })
  @ApiResponse({ 
    status: 200, 
    description: 'URL pré-assinada gerada com sucesso',
    schema: {
      example: {
        message: 'URL pré-assinada gerada com sucesso',
        presignedUrl: 'https://bucket.s3.amazonaws.com/movies/image.jpg?signature=...',
        fileName: 'image.jpg',
        contentType: 'image/jpeg',
        expiresIn: 3600
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
