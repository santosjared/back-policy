import { PartialType } from "@nestjs/swagger";
import { CreateTypeComplaintsDto } from "./create-type-complaints.dto";

export class UpdateTypeComplaintsDto extends PartialType(CreateTypeComplaintsDto){}