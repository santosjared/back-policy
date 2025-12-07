import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';


export class ComplaintsClientDto {
    
    @IsOptional()
    @IsString()
    userId:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    complaints:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    aggressor:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    victim:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    place:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    description:string

    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    latitude: number;
  
    @ApiProperty()
    @IsNumber()
    @Type(() => Number)
    @IsOptional()
    longitude: number;

    @ApiProperty()
    @IsArray()
    @IsOptional()
    images:Array<String>

    @ApiProperty()
    @IsString()
    @IsOptional()
    video:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    otherComplaints:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    otherAggresor:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    otherVictim:string
}
