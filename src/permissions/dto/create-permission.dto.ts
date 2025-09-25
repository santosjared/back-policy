import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class CreatePermissionDto {
  @ApiProperty({ type: () => [PermissionItemDto] })
  @IsArray()
  permissions: PermissionItemDto[]
}

export class PermissionItemDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  action: string[]

  @ApiProperty()
  @IsString()
  subject: string

  @IsOptional()
  @IsString()
  _id:string

}
