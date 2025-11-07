import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Length, ValidateIf } from "class-validator";

export class EmergencyComplaintDto {

    @IsOptional()
    @IsString()
    userId: string

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    latitude: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    longitude: number;

    @IsOptional()
    @ValidateIf(({ phone }) => typeof phone === 'string' || typeof phone === 'number')
    @IsString()
    @Length(6, 8)
    contact: string
}