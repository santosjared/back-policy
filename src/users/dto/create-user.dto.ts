import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    grade: string
    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido paterno solo puede contener letras y espacios' })
    @IsString({ message: 'El campo apellido paterno debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    paternalSurname: string
    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido materno solo puede contener letras y espacios' })
    @IsString({ message: 'El campo apellido materno debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    maternalSurname: string
    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El 1er. nombre solo puede contener letras y espacios' })
    @IsString({ message: 'El campo 1er. nombre debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    firstName: string
    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El 2do. nombre solo puede contener letras y espacios' })
    @IsString({ message: 'El campo 2do. nombre debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    lastName: string
    @ApiProperty()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 64)
    @IsEmail()
    email: string
    @ApiProperty()
    @IsNumber()
    phone: string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 32)
    password: string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    exp: string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    post: string
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    ci: String
    @ApiProperty()
    @IsString()
    gender: string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    address: string
    @ApiProperty()
    @IsOptional()
    @IsString()

    @IsOptional()
    @IsString()
    status: string
    @ApiProperty()
    @IsOptional()
    @IsString()
    rol: string
}
