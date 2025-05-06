import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateDenunciaDto {
    @ApiProperty()
    @IsString()
    name:string

    @ApiProperty()
    @IsOptional()
    denuncias:any
}
