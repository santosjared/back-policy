import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class AuthGoogleDto {
    @ApiProperty()
    @IsString()
    token:string
}