import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsString, Length, Matches, ValidateIf } from 'class-validator'


export class createPersonDto {
    @IsOptional()
    @IsString({ message: 'El campo nombre debe ser una cadena de caracteres de Aa - Zz' })
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    name: string

    @IsOptional()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @IsString({ message: 'El campo apellido debe ser una cadena de caracteres Aa - Zz' })
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4, 20)
    lastName: string

    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 64)
    @IsEmail()
    email: string

    @IsOptional()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(8, 32)
    password: string

    @IsOptional()
    @Transform(({ value }) => {
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'string') return value.trim();
        return value;
    })
    @ValidateIf(({ phone }) => typeof phone === 'string' || typeof phone === 'number')
    @IsString()
    @Length(6, 8)
    phone: string

    @IsOptional()
    @IsString()
    profile: string

    @IsOptional()
    @IsString()
    rol: string

}


