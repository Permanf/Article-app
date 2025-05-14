import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  description: string;

  @IsString()
  @IsNotEmpty()
  publicationDate: string;
}