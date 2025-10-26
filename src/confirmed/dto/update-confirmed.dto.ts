import { PartialType } from '@nestjs/swagger';
import { CreateConfirmedDto } from './create-confirmed.dto';

export class UpdateConfirmedDto extends PartialType(CreateConfirmedDto) {}
