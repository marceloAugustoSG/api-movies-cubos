import { IsString, IsNumber, IsDateString, Min, Max, IsOptional, IsArray } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  title: string;

  @IsString()
  originalTitle: string;

  @IsString()
  description: string;

  @IsDateString()
  releaseDate: string;

  @IsNumber()
  @Min(1)
  duration: number;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  revenue?: number;

  @IsOptional()
  @IsNumber()
  profit?: number;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  slogan?: string;

  @IsOptional()
  @IsString()
  trailerUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rating: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  voteCount?: number;

  @IsOptional()
  @IsString()
  ageRating?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  genres?: string[];

  @IsString()
  userId: string;
}
