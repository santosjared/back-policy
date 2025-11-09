import {
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
  ValidateIf,
} from 'class-validator';

export class CreatePatrolDto {
  @IsString({ message: 'La placa debe ser una cadena de texto' })
  @MinLength(4, { message: 'La placa debe tener al menos 4 caracteres' })
  @MaxLength(10, { message: 'La placa no puede tener más de 10 caracteres' })
  plaque: string;

  @IsString({ message: 'El código debe ser una cadena de texto' })
  @MinLength(2, { message: 'El código debe tener al menos 2 caracteres' })
  @MaxLength(20, { message: 'El código no puede tener más de 20 caracteres' })
  code: string;

  @IsString({ message: 'La marca de vehículo es requerida' })
  marker: string;

  @ValidateIf(o => o.marker === 'Otro')
  @IsString({ message: 'Debe especificar otra marca' })
  @MinLength(2, { message: 'Debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'No puede tener más de 30 caracteres' })
  otherMarker?: string;

  @IsString({ message: 'El tipo de vehículo es requerido' })
  type: string;

  @ValidateIf(o => o.type === 'Otro')
  @IsString({ message: 'Debe especificar otro tipo de vehículo' })
  @MinLength(2, { message: 'Debe tener al menos 2 caracteres' })
  @MaxLength(30, { message: 'No puede tener más de 30 caracteres' })
  otherType?: string;

  @IsOptional()
  @IsString({ message: 'La URL de la imagen debe ser una cadena de texto' })
  @MaxLength(255, { message: 'La URL no puede tener más de 255 caracteres' })
  imageUrl?: string;
}
