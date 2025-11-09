import { PartialType } from '@nestjs/swagger';
import { CreatePermissionDto } from '../../roles/dto/create-permission.dto';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {}
