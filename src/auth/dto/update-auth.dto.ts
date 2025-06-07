import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword, Length } from 'class-validator';

export class UpdateAuthDto {
    @ApiProperty()
    @IsString()
    token: string
    @ApiProperty()
    @IsString()
    @Length(8, 32)
    password: string;
}
