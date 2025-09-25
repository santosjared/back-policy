import { ApiProperty } from '@nestjs/swagger';
import { IsEmail,IsString } from 'class-validator';

export class CreateAuthDto {

    @ApiProperty()
    @IsEmail()
    @IsString()
    email: string;

    @ApiProperty()
    @IsString()
    password: string;
}
