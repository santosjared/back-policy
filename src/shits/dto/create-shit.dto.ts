import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, Length } from "class-validator";

export class CreateShitDto {

    @ApiProperty()
    @IsString({ message: 'El nombre del supervisor debe ser una cadena de texto.' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(3, 62, { message: 'El nombre del supervisor debe tener entre 3 y 62 caracteres.' })
    supervisor: string;

    @ApiProperty()
    @IsString()
    grade: string

    @ApiProperty()
    @IsOptional()
    @IsString({ message: 'El otro grado del supervisor debe ser una cadena de texto.' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    otherGrade: string

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