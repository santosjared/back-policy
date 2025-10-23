import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UserPatrolsDto {
    @IsString()
    patrols: string;

    @IsArray()
    @IsString({ each: true })
    user: string[];
}

export class CreateAtendidoDto {
    @IsString()
    complaint: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UserPatrolsDto)
    userpatrol: UserPatrolsDto[];
}
