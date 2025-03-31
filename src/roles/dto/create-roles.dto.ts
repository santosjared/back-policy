import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateRolDto {

    @ApiProperty()
    @IsString()
    name:string

    @ApiProperty()
    @IsArray({context:String})
    perssisions: Array<[]>
}