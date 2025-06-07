import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateTypeComplaintsDto {
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(4,200)
    name:string
    @ApiProperty()
    @IsString()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    @Length(10,1000)
    description:string
    @ApiProperty()
    @IsString()
    image:string
}