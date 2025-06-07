import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class SendEmailDto {
    @ApiProperty()
    @IsEmail()
    email:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    code:string
}