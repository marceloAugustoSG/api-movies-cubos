import { IsString, IsNotEmpty } from 'class-validator';

export class PresignedUrlDto {
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;
}
