import { PartialType } from '@nestjs/swagger';
import { CreateShitDto } from './create-shit.dto';

export class UpdateShitDto extends PartialType(CreateShitDto) {}
