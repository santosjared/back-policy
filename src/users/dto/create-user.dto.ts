import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNumber, IsNumberString, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  grade: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  otherGrade: string

  @ApiProperty()
  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido paterno solo puede contener letras y espacios' })
  @IsString({ message: 'El campo apellido paterno debe ser una cadena de caracteres Aa - Zz' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(3, 20)
  paternalSurname: string
  @ApiProperty()
  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El apellido materno solo puede contener letras y espacios' })
  @IsString({ message: 'El campo apellido materno debe ser una cadena de caracteres Aa - Zz' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(3, 20)
  maternalSurname: string
  @ApiProperty()
  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El 1er. nombre solo puede contener letras y espacios' })
  @IsString({ message: 'El campo 1er. nombre debe ser una cadena de caracteres Aa - Zz' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(3, 20)
  firstName: string
  @ApiProperty()
  @IsOptional()
  @Matches(/^[A-Za-z\s]+$/, { message: 'El 2do. nombre solo puede contener letras y espacios' })
  @IsString({ message: 'El campo 2do. nombre debe ser una cadena de caracteres Aa - Zz' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(3, 20)
  lastName: string
  @ApiProperty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(8, 64)
  @IsEmail()
  email: string
  @ApiProperty()
  @IsNumberString({}, { message: 'El teléfono solo puede contener números' })
  @Transform(({ value }) => value?.toString().trim())
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

  @ApiProperty()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  otherPost: string

  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  ci: String
  @ApiProperty()
  @IsString()
  gender: 'Masculino' | 'Femenino'
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
