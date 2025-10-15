import { IsOptional, IsString } from "class-validator";

export class CreatePatrolDto {
    
    @IsString()
    plaque: string;

    @IsString()
    code: string;

    @IsString()
    marker: string;

    @IsOptional()
    @IsString()
    otherMarker: string;

    @IsOptional()
    @IsString()
    otherType: string;

    @IsString()
    type: string;

    @IsOptional()
    @IsString()
    imageUrl: string;

}
