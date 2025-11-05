import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


class Infractor {
    @IsString()
    apellido_paterno: string
    @IsString()
    apellido_materno: string
    @IsString()
    nombres: string
    @IsString()
    ci: string
    @IsNumber()
    edad: number
    @IsString()
    ocupation: string
    @IsOptional()
    @IsString()
    alias: string

    @IsString()
    @IsOptional()
    _id:string

}

export class CreateConfirmedDto {

    @IsString()
    atendido:string
    @IsString()
    sigla: string
    @IsString()
    encargado: string
    @IsString()
    fecha_hecho: string
    @IsString()
    hora_hecho: string
    @IsString()
    lugar_hecho: string
    @IsString()
    tipo_denuncia: string

    @IsOptional()
    @IsString()
    otra_denuncia: string
    @ValidateNested({ each: true })
    @Type(() => Infractor)
    infractores: Infractor[];
    @IsString()
    description:string

}
