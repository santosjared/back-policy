
import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateAuthDto {
    @ApiProperty()
    @IsString()
    token: string
    @ApiProperty()
    @IsString()
    @Length(8, 32)
    password: string;
}
