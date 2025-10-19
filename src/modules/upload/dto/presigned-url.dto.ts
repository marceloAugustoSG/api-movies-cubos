import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlDto {
  @ApiProperty({
    description: 'Nome do arquivo para upload',
    example: 'poster-filme.jpg'
  })
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @ApiProperty({
    description: 'Tipo de conteúdo do arquivo',
    example: 'image/jpeg',
    enum: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  })
  @IsString()
  @IsNotEmpty()
  contentType: string;
}
