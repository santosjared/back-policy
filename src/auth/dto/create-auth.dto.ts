import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,IsString,IsStrongPassword, Length } from 'class-validator';

export class CreateAuthDto {

    @ApiProperty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    @Length(8, 32)
    password: string;
}
