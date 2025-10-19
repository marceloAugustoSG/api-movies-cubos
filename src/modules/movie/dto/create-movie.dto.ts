import {
  IsString,
  IsNumber,
  IsDateString,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMovieDto {
  @ApiProperty({
    description: 'Título do filme',
    example: 'O Poderoso Chefão'
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Título original do filme',
    example: 'The Godfather'
  })
  @IsString()
  originalTitle: string;

  @ApiProperty({
    description: 'Descrição do filme',
    example: 'A história de uma família de mafiosos italianos na América'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Data de lançamento do filme',
    example: '1972-03-24',
    format: 'date'
  })
  @IsDateString()
  releaseDate: string;

  @ApiProperty({
    description: 'Duração do filme em minutos',
    example: 175,
    minimum: 1
  })
  @IsNumber()
  @Min(1)
  duration: number;

  @ApiProperty({
    description: 'Orçamento do filme em dólares',
    example: 6000000,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  budget: number;

  @ApiPropertyOptional({
    description: 'Receita do filme em dólares',
    example: 287000000,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @ApiPropertyOptional({
    description: 'Lucro do filme em dólares',
    example: 281000000,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  profit?: number;

  @ApiProperty({
    description: 'URL da imagem do filme',
    example: 'https://example.com/poster.jpg'
  })
  @IsString()
  @Transform(({ value }) => {
    if (typeof value === 'object' && value !== null && value.imageUrl) {
      return value.imageUrl;
    }
    return value;
  })
  imageUrl: string;

  @ApiPropertyOptional({
    description: 'Slogan do filme',
    example: 'Uma oferta que você não pode recusar'
  })
  @IsOptional()
  @IsString()
  slogan?: string;

  @ApiPropertyOptional({
    description: 'URL do trailer do filme',
    example: 'https://youtube.com/watch?v=trailer'
  })
  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @ApiProperty({
    description: 'Nota do filme (0-100)',
    example: 92,
    minimum: 0,
    maximum: 100
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  rating: number;

  @ApiPropertyOptional({
    description: 'Número de votos',
    example: 1500000,
    minimum: 0
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  voteCount?: number;

  @ApiPropertyOptional({
    description: 'Classificação etária',
    example: '18+'
  })
  @IsOptional()
  @IsString()
  ageRating?: string;

  @ApiPropertyOptional({
    description: 'Status do filme',
    example: 'Released'
  })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({
    description: 'Idioma do filme',
    example: 'English'
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({
    description: 'Gêneros do filme',
    example: ['Drama', 'Crime'],
    type: [String]
  })
  @IsOptional()
  @IsArray()
  genres?: string[];

  @ApiProperty({
    description: 'ID do usuário que está criando o filme',
    example: '1'
  })
  @IsString()
  userId: string;
}
