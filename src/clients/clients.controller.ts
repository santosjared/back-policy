import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
@ApiTags('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto){
    return this.clientsService.create(createClientDto);
  }
  @Get('check-email/:email')
  async checkEmail(@Param('email') email:string){
    const result = await this.clientsService.checkEmail(email)
    return {result}
  }
}
