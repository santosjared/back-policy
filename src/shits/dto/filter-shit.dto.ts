import { IsNumber, IsOptional, IsString } from "class-validator";

export class FilterShitDto {
    @IsOptional()
    @IsString()
    field?: string;

    @IsOptional()
    @IsNumber()
    skip?: number;
    
    @IsOptional()
    @IsNumber()
    limit?: number;
}