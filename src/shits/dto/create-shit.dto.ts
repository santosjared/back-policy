import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";

export class CreateShitDto {

    @ApiProperty()
    @IsString()
    supervisor: string

    @ApiProperty()
    @IsString()
    date: string
    
    @ApiProperty()
    @IsArray()
    hrs: HourRange[]
}

class HourRange {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    hrs_i: string

    @ApiProperty()
    @IsString()
    hrs_s: string
    @ApiProperty()
    @IsOptional()
    @IsArray()
    @Type(() => Services)
    services: Services[]
}
class Services {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    otros: string

    @ApiProperty()
    @IsArray()
    @IsOptional()
    users: Users[]
}

class Users{

    @IsString()
    @IsOptional()
    cargo:string
    @IsString()
    @IsOptional()
    user:string
}