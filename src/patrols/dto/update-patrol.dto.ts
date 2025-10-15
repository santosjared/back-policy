import { PartialType } from '@nestjs/swagger';
import { CreatePatrolDto } from './create-patrol.dto';

export class UpdatePatrolDto extends PartialType(CreatePatrolDto) {}
