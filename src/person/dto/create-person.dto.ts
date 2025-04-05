import { ApiProperty } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, Matches } from 'class-validator'


export class createPersonDto {
    @ApiProperty()
    @IsString({message:'El campo nombre debe ser una cadena de caracteres de Aa - Zz'})
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @Transform(({ value }) => value.trim()) 
    @Length(4,20)
    name:string

    @ApiProperty()
    @Matches(/^[A-Za-z\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    @IsString({message:'El campo apellido debe ser una cadena de caracteres Aa - Zz'})
    @Transform(({ value }) => value.trim()) 
    @Length(4,20)
    lastName:string

    @ApiProperty()
    @Transform(({ value }) => value.trim()) 
    @Length(8,64)
    @IsEmail()
    email:string

    @ApiProperty()
    @IsString()
    @Transform(({ value }) => value.trim()) 
    @Length(8,32)
    password:string
     
    @ApiProperty()
    @Transform(({ value }) => value.trim()) 
    @IsPhoneNumber()
    @Length(6,16)
    phone:string

    @IsOptional()
    @IsString()
    profile:string
    
}