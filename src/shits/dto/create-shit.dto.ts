import { Transform, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, Length } from "class-validator";

export class CreateShitDto {

    @IsString({ message: 'El nombre del supervisor debe ser una cadena de texto.' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(3, 62, { message: 'El nombre del supervisor debe tener entre 3 y 62 caracteres.' })
    supervisor: string;

    @IsString()
    grade: string

    @IsOptional()
    @IsString({ message: 'El otro grado del supervisor debe ser una cadena de texto.' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    otherGrade: string

    @IsString()
    date: string

    @IsArray()
    hrs: HourRange[]
}

class HourRange {
    @IsString()
    name: string

    @IsString()
    hrs_i: string

    @IsString()
    hrs_s: string

    @IsOptional()
    @IsArray()
    @Type(() => Services)
    services: Services[]

    @IsOptional()
    @IsString()
    _id: string
}
class Services {
    @IsString()
    services: string

    @IsOptional()
    @IsString()
    otherService: string

    @IsString()
    @IsOptional()
    zone: string

    @IsOptional()
    @IsOptional()
    otherZone: string

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