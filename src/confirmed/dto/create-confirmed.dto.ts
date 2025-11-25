import {
    Transform,
    Type
} from "class-transformer";
import {
    IsString,
    IsOptional,
    IsNumber,
    Min,
    Max,
    MinLength,
    MaxLength,
    Matches,
    ValidateNested,
    IsBoolean,
    ValidateIf
} from "class-validator";

class Infractor {

    @IsOptional()
    @IsString({ message: 'El apellido paterno debe ser una cadena de texto' })
    @MinLength(2, { message: 'El campo apellido paterno debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El campo apellido paterno no puede tener más de 50 caracteres' })
    apellido_paterno?: string;

    @IsOptional()
    @IsString({ message: 'El apellido materno debe ser una cadena de texto' })
    @MinLength(2, { message: 'El campo apellido materno debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El campo apellido materno no puede tener más de 50 caracteres' })
    apellido_materno?: string;

    @IsString({ message: 'El nombre del arrestado es requerido' })
    @MinLength(2, { message: 'El campo nombres debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El campo nombres no puede tener más de 100 caracteres' })
    nombres: string;

    @IsString({ message: 'El número de cédula es requerido' })
    @Matches(/^[0-9A-Za-z-]+$/, { message: 'El número de cédula contiene caracteres inválidos' })
    @MinLength(5, { message: 'El número de cédula es demasiado corto' })
    @MaxLength(20, { message: 'El número de cédula es demasiado largo' })
    ci: string;

    @IsNumber({}, { message: 'La edad debe ser un número' })
    @Min(10, { message: 'La edad mínima es 10 años' })
    @Max(120, { message: 'La edad máxima es 120 años' })
    edad: number;

    @IsString({ message: 'La ocupación es requerida' })
    @MinLength(2, { message: 'El campo ocupación debe tener al menos 2 caracteres' })
    @MaxLength(100, { message: 'El campo ocupación no puede tener más de 100 caracteres' })
    ocupation: string;

    @IsOptional()
    @IsString({ message: 'El alias debe ser una cadena de texto' })
    @MinLength(2, { message: 'El campo alias debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El campo alias no puede tener más de 50 caracteres' })
    alias?: string;

    @IsOptional()
    @IsString()
    _id?: string;
}

export class CreateConfirmedDto {

    @IsString({ message: 'El campo atendido es requerido' })
    atendido: string;

    @IsString({ message: 'El campo sigla es requerido' })
    @MinLength(2, { message: 'La sigla debe tener al menos 2 caracteres' })
    @MaxLength(32, { message: 'La sigla no puede tener más de 32 caracteres' })
    sigla: string;

    @IsString({ message: 'El campo encargado es requerido' })
    encargado: string;

    @IsString({ message: 'La fecha del hecho es requerida' })
    @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'La fecha debe tener el formato YYYY-MM-DD' })
    fecha_hecho: string;

    @IsString({ message: 'La hora del hecho es requerida' })
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'La hora debe tener el formato HH:mm' })
    hora_hecho: string;

    @IsString({ message: 'El lugar del hecho es requerido' })
    @MinLength(4, { message: 'El lugar debe tener al menos 4 caracteres' })
    @MaxLength(150, { message: 'El lugar no puede tener más de 150 caracteres' })
    lugar_hecho: string;

    @ValidateIf(o => !o.isNegative)
    @IsString({ message: 'Debe seleccionar el tipo de denuncia' })
    tipo_denuncia: string;

    @IsBoolean()
    isNegative: boolean

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed === '' ? undefined : trimmed;
        }
        return value;
    })
    @IsString({ message: 'El campo otra denuncia debe ser texto' })
    @MinLength(3, { message: 'El campo otra denuncia debe tener al menos 3 caracteres' })
    @MaxLength(100, { message: 'El campo otra denuncia no puede exceder 100 caracteres' })
    otra_denuncia?: string;

    @ValidateNested({ each: true })
    @Type(() => Infractor)
    infractores: Infractor[];

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const trimmed = value.trim();
            return trimmed === '' ? null : trimmed;
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
}
