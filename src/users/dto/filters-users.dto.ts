import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class FiltersUsersDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsNumberString()
  skip?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;
}