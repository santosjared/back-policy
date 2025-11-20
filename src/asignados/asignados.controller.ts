import { Controller, Get, Param, Put, Query, UseGuards } from "@nestjs/common";
import { AsignadosService } from "./asignados.service";
import { FiltersAsignadosDto } from "./dto/filters-asignados.dto";
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { PermissionsGuard } from 'src/casl/guards/permissions.guard';
import { CheckAbilities } from 'src/casl/decorators/permission.decorator';


@Controller('asignados')
export class AsignadosController {
    constructor(private readonly asignadosService: AsignadosService) { }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @CheckAbilities({ action: 'read', subject: 'asignes' })
    @Get()
    async findAll(@Query() filters: FiltersAsignadosDto) {
        return await this.asignadosService.findAll(filters);
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @CheckAbilities({ action: 'print', subject: 'asignes' })
    @Get('print')
    async print(@Query() { date }: { date: string }) {
        if (date) {
            return await this.asignadosService.generarPdF(date);
        }
        return null
    }

    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @CheckAbilities({ action: 'confirmed', subject: 'asignes' })
    @Put(':id')
    async update(@Param('id') id: string) {
        return await this.asignadosService.update(id);
    }
}