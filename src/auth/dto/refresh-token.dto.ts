import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RefresTokenDto{
    @ApiProperty()
    @IsString()
    token:string
}