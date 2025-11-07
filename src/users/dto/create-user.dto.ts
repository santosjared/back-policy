
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
  MaxLength,
  IsNumberString,
  ValidateIf,
} from 'class-validator';

export class CreateUserDto {
  
  @IsNotEmpty({ message: 'El campo grado es requerido' })
  @IsString()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  grade: string;

  @ValidateIf(o => o.grade === 'Otro')
  @IsString()
  @MinLength(3, { message: 'El campo otro grado debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo otro grado no debe exceder más de 50 caracteres' })
  otherGrade?: string;

  @IsOptional()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El campo apellido paterno solo debe contener letras' })
  @IsString()
  @MinLength(3, { message: 'El campo apellido paterno debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo apellido paterno no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  paternalSurname?: string;

  @IsOptional()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El campo apellido materno solo debe contener letras' })
  @IsString()
  @MinLength(3, { message: 'El campo apellido materno debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo apellido materno no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  maternalSurname?: string;

  @IsNotEmpty({ message: 'El campo 1er. nombre es requerido' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El campo 1er. nombre solo debe contener letras' })
  @IsString()
  @MinLength(3, { message: 'El campo 1er. nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo 1er. nombre no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  firstName: string;

  @IsOptional()
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El campo 2do. nombre solo debe contener letras' })
  @IsString()
  @MinLength(3, { message: 'El campo 2do. nombre debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo 2do. nombre no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  lastName?: string;

  @IsEmail({}, { message: 'Debe ingresar un correo electrónico válido' })
  @MinLength(5, { message: 'El correo electrónico debe tener al menos 5 caracteres' })
  @MaxLength(100, { message: 'El correo electrónico no debe exceder más de 100 caracteres' })
  @IsNotEmpty({ message: 'El campo correo electrónico es requerido' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo ci es requerido' })
  @MinLength(7, { message: 'El campo ci debe tener al menos 7 caracteres' })
  @MaxLength(10, { message: 'El campo ci no debe exceder más de 10 caracteres' })
  ci: string;

  @IsString()
  @IsNotEmpty({ message: 'Seleccione la expedición del carnet' })
  @MinLength(2, { message: 'La expedición del ci debe tener al menos 2 caracteres' })
  @MaxLength(10, { message: 'La expedición del ci no debe exceder más de 10 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  exp: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo cargo es requerido' })
  @MinLength(2, { message: 'El campo cargo debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El campo cargo no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  post: string;

  @ValidateIf(o => o.post === 'Otro')
  @IsString()
  @MinLength(3, { message: 'El campo otro cargo debe tener al menos 3 caracteres' })
  @MaxLength(50, { message: 'El campo otro cargo no debe exceder más de 50 caracteres' })
  otherPost?: string;

  @IsNumberString({}, { message: 'El celular debe contener solo números' })
  @MinLength(6, { message: 'El celular debe tener al menos 6 dígitos' })
  @MaxLength(15, { message: 'El celular no debe exceder más de 15 dígitos' })
  @IsNotEmpty({ message: 'El campo celular es requerido' })
  @Transform(({ value }) => value?.toString().trim())
  phone: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo dirección es requerido' })
  @MinLength(3, { message: 'El campo dirección debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El campo dirección no debe exceder más de 100 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  address: string;

  @IsString()
  @MinLength(8, { message: 'El campo contraseña debe tener al menos 8 caracteres' })
  @MaxLength(32, { message: 'El campo contraseña no debe exceder más de 32 caracteres' })
  @IsNotEmpty({ message: 'El campo contraseña es requerido' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El campo sexo es obligatorio' })
  gender: 'Masculino' | 'Femenino';

  @IsString()
  @IsNotEmpty({ message: 'El campo rol es requerido' })
  @MinLength(2, { message: 'El campo rol debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El campo rol no debe exceder más de 50 caracteres' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  rol: string;

  @IsOptional()
  @IsString()
  status?: string;
}
