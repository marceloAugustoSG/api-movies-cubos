import { IsString, IsNumber, IsDateString, Min } from 'class-validator';

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

    @IsString()
    imageUrl: string;

    @IsString()
    userId: string;
}
