import { Transform } from "class-transformer";
import {
  IsString,
  Length,
  IsOptional,
  MaxLength,
  MinLength
} from "class-validator";

export class CreateTypeComplaintsDto {
  @IsString({ message: 'El tipo de denuncia debe ser una cadena de texto' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @Length(3, 50, {
    message: 'El tipo de denuncia debe contener entre 3 y 50 caracteres'
  })
  name: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed === '' ? undefined : trimmed;
    }
    return value;
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres',
  })
  @MaxLength(1000, {
    message: 'La descripción no puede tener más de 1000 caracteres',
  })
  description?: string;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La URL de la imagen no debe exceder los 500 caracteres' })
  image?: string;
}
