import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Rol, RolDocument } from './schema/roles.schema';
import { Model } from 'mongoose';
import { CreateRolDto } from './dto/create-roles.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { CreatePermissionDto } from 'src/roles/dto/create-permission.dto';
import { Permission, PermissionDocument } from 'src/roles/schema/persmissions.schema';
import { FiltersRolesDto } from './dto/filters-roles.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Rol.name) private readonly rolModel: Model<RolDocument>,
        @InjectModel(Permission.name) private readonly permissionModel: Model<PermissionDocument>
    ) { }

    async create(createRolDto: CreateRolDto) {
        try {
            return await this.rolModel.create(createRolDto)
        } catch (e) {
            console.log('error al crear rol', e);
            throw new HttpException('interval server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async findAll(filters: FiltersRolesDto) {
        const { field = '', skip = 0, limit = 10 } = filters

        let query: any = { isRoot: { $ne: true } };
        if (field) {
            const orFilters: any[] = [
                { name: { $regex: field, $options: 'i' } },
                { description: { $regex: field, $options: 'i' } },
            ];
            query = { ...query, $or: orFilters };
        }
        const safeLimit = Math.min(limit, 100);
        const result = await this.rolModel.find(query)
            .populate({path:'permissions', select:'-isRoot -__v'})
            .select('-isRoot -__v -createdAt -updatedAt')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(safeLimit)
            .exec()
        const total = await this.rolModel.countDocuments(query)
        return { result, total }
    }

    async update(id: string, updateRolDto: UpdateRolDto) {
        console.log(updateRolDto)
        const role = await this.rolModel.findById(id)
        if (!role) {
            throw new NotFoundException('Rol no encontrado')
        }
        if (role.isRoot) {
            throw new UnauthorizedException('no tienes autorizacion para actualizar este rol')
        }
        return await this.rolModel.findByIdAndUpdate(id, updateRolDto);
    }

    async delete(id: string) {
        const role = await this.rolModel.findById(id)
        if (!role) {
            throw new NotFoundException('Rol no encontrado')
        }
        if (role.isRoot) {
            throw new UnauthorizedException('no tienes autorizacion para eliminar este rol')
        }
        const updateRole = await this.rolModel.findByIdAndDelete(id)
        await Promise.all(
            updateRole.permissions.map(async id => await this.permissionModel.findByIdAndDelete(id))
        )
        return updateRole
    }

    async asignePermission(id: string, createPermissions: CreatePermissionDto) {

        const role = await this.rolModel.findById(id)
        if (!role) {
            throw new NotFoundException('Rol no encontrado')
        }
        if (role.isRoot) {
            throw new UnauthorizedException('no tienes autorizacion para actualizar este rol')
        }
        const permissions = await Promise.all(
            createPermissions.permissions.map(async per => {
                if (per._id) {
                    await this.permissionModel.findByIdAndUpdate(per._id, per);
                    return per._id;
                } else {
                    const created = await this.permissionModel.create(per);
                    return created._id;
                }
            })
        );

        return await this.rolModel.findByIdAndUpdate(id, { permissions });
    }


    async findOne(id: string): Promise<any> {
        return await this.rolModel.findById(id).populate('permissions');
    }

}
