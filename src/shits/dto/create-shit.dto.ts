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

    @IsOptional()
    @IsString()
    _id: string
}
class Services {
    @ApiProperty()
    @IsString()
    services: string

    @ApiProperty()
    @IsOptional()
    @IsString()
    otherService: string

    @ApiProperty()
    @IsString()
    @IsOptional()
    zone: string

    @ApiProperty()
    @IsOptional()
    @IsOptional()
    otherZone: string

    @ApiProperty()
    @IsArray()
    @IsOptional()
    users: Users[]

    @IsOptional()
    @IsString()
    _id: string
}

class Users {

    @IsString()
    @IsOptional()
    cargo: string
    @IsString()
    @IsOptional()
    user: string

    @IsOptional()
    @IsString()
    _id: string
}