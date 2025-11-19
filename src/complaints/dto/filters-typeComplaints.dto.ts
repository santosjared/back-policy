import { Type } from 'class-transformer';
import { IsOptional, IsNumberString, IsString, IsNumber } from 'class-validator';

export class FiltersTypeComplaintsDto {
  @IsOptional()
   @IsString()
   field?: string;
 
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   skip?: number;
 
   @IsOptional()
   @Type(() => Number)
   @IsNumber()
   limit?: number;
}