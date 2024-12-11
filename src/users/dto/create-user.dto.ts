import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, Length, MaxLength, MinLength } from 'class-validator';
import { IsFile } from 'src/utils/decorator/file.decorator';

export class CreateUserDto {

    @ApiProperty()
    @IsString({message:'El nombre debe ser una cadena de caracteres'})
    // @Length(2,40,{message:'El nombre debe contener como minimo 2 carateres y maximo 40'})
    name:string

    @ApiProperty()
    @IsString({message:'El Apellido debe ser una cadena de caracteres'})
    // @Length(2,64,{message:'El apellido debe contener como minimo 2 carateres y maximo 64'})
    lastName:string

    @ApiProperty()
    @IsString({message:'El Ci debe ser una cadena de caracteres'})
    // @Length(6,32,{message:'El Ci debe contener como minimo 6 carateres y maximo 32'})
    ci:string

    @ApiProperty()
    @IsString()//
    // @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    // @IsStrongPassword()
    password:string
    
    @ApiProperty()
    @IsString({message:'El genero debe ser una cadena de caracteres'})
    // @Length(4,32,{message:'El genero debe contener como minimo 4 carateres y maximo 32'})
    gender:string

    @ApiProperty()
    @IsString()
    // @IsPhoneNumber()
    phone:string

    @ApiProperty()
    @IsString({message:'La direccion debe ser una cadena de caracteres'})
    // @Length(2,32,{message:'La direccion debe contener como minimo 2 carateres y maximo 32'})
    address:string

    @ApiProperty()
    @IsString({message:'El pais debe ser una cadena de caracteres'})
    // @Length(2,64,{message:'El pais debe contener como minimo 2 carateres y maximo 64'})
    contry:string

    @IsOptional()
    profile:any
}
