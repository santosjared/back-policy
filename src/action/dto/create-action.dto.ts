import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateActionDto {
    @ApiProperty()
    @IsString()
    name:string
}
