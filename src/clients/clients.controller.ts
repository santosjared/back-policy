import { Body, Controller, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Body() createClientDto: CreateClientDto){
    return this.clientsService.create(createClientDto);
  }
}
