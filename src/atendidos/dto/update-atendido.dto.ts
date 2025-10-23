import { PartialType } from '@nestjs/swagger';
import { CreateAtendidoDto } from './create-atendido.dto';

export class UpdateAtendidoDto extends PartialType(CreateAtendidoDto) {}
