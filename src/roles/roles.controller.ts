import { Body, Controller, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRolDto } from './dto/create-roles.dto';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Post()
  create(@Body() createRolDto:CreateRolDto){
    return this.rolesService.create(createRolDto);
  }
}
