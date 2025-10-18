import { IsOptional, IsInt, IsPositive, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { MovieFilterDto } from './movie-filter.dto';

export class MovieFilterPaginatedDto extends MovieFilterDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @IsPositive()
  limit?: number = 10;
}
