import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class FiltersAtendidosDto {
  @IsOptional()
  @IsString()
  field?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  skip?: number;
  
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
