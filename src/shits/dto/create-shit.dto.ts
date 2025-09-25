import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsDate, IsString } from "class-validator";

export class CreateShitDto {

    @ApiProperty()
    @IsString()
    supervisor: string

    @ApiProperty()
    @IsString()
    date: string
    
    @ApiProperty()
    @IsArray()
    hrs: HourRange[]
}

class HourRange {
    @ApiProperty()
    @IsString()
    name: string

    @ApiProperty()
    @IsString()
    hrs_i: string

    @ApiProperty()
    @IsString()
    hrs_s: string
}
