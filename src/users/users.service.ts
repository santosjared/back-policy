import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Users, UsersDocument } from './schema/users.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { Grade, GradeDocument } from './schema/grade.schema';
import { Post, PostDocument } from './schema/post.schema';
import { FiltersUsersDto } from './dto/filters-users.dto';
import { Auth, AuthDocument } from 'src/auth/schema/auth.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private readonly usersModel: Model<UsersDocument>,
    @InjectModel(Rol.name) private readonly rolesModel: Model<RolDocument>,
    @InjectModel(Grade.name) private readonly gradesModel: Model<GradeDocument>,
    @InjectModel(Post.name) private readonly postsModel: Model<PostDocument>,
    @InjectModel(Auth.name) private readonly authModel: Model<AuthDocument>,
  ) { }
  async create(createUserDto: CreateUserDto) {

    const password = await bcrypt.hash(createUserDto.password, 10);

    if (createUserDto.otherGrade) {
      const newGrade = await this.gradesModel.create({ name: createUserDto.otherGrade })
      createUserDto.grade = newGrade._id.toString();
    }
    if (createUserDto.otherPost) {
      const newPost = await this.postsModel.create({ name: createUserDto.otherPost })
      createUserDto.post = newPost._id.toString();
    }
    await this.authModel.create({ email: createUserDto.email, password })
    return await this.usersModel.create(createUserDto)
  }

  async findAll(filters: FiltersUsersDto): Promise<{ result: UsersDocument[]; total: number }> {
    const { field = '', skip = 0, limit = 10 } = filters;

    let query: any = { isRoot: { $ne: true } };
    if (field) {
      const [matchedRoles, matchedGrades, matchedPosts] = await Promise.all([
        this.rolesModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
        this.gradesModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
        this.postsModel.find({ name: { $regex: field, $options: 'i' } }).select('_id'),
      ]);

      const orFilters: any[] = [
        { paternalSurname: { $regex: field, $options: 'i' } },
        { maternalSurname: { $regex: field, $options: 'i' } },
        { firstName: { $regex: field, $options: 'i' } },
        { lastName: { $regex: field, $options: 'i' } },
        { exp: { $regex: field, $options: 'i' } },
        { email: { $regex: field, $options: 'i' } },
        { ci: { $regex: field, $options: 'i' } },
        { address: { $regex: field, $options: 'i' } },
        { phone: { $regex: field, $options: 'i' } },
        { gender: { $regex: field, $options: 'i' } },
        { status: { $regex: field, $options: 'i' } },
      ];

      if (matchedGrades.length) orFilters.push({ grade: { $in: matchedGrades.map(g => g._id) } });
      if (matchedRoles.length) orFilters.push({ rol: { $in: matchedRoles.map(r => r._id) } });
      if (matchedPosts.length) orFilters.push({ post: { $in: matchedPosts.map(p => p._id) } });

      query = { ...query, $or: orFilters };
    }
    const safeLimit = Math.min(limit, 100);
    const result = await this.usersModel
      .find(query)
      .select('-password -__v -isRoot -createdAt -updatedAt')
      .sort({ createdAt: -1 })
      .populate('rol grade post')
      .skip(skip)
      .limit(safeLimit)
      .exec();
    const total = await this.usersModel.countDocuments(query);

    return { result, total };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
  const updateData: any = { ...updateUserDto }

  if (updateUserDto.password) {
    updateData.password = await bcrypt.hash(updateUserDto.password, 10)
  } else {
    delete updateData.password
  }

  if (updateUserDto.otherGrade) {
    const newGrade = await this.gradesModel.create({ name: updateUserDto.otherGrade })
    updateData.grade = newGrade._id.toString()
  }

  if (updateUserDto.otherPost) {
    const newPost = await this.postsModel.create({ name: updateUserDto.otherPost })
    updateData.post = newPost._id.toString()
  }

  const user = await this.usersModel.findById(id)
  if (!user) {
    throw new NotFoundException('Usuario no encontrado')
  }

  if (user.isRoot) {
    throw new UnauthorizedException('No tienes autorización para actualizar este usuario')
  }

  const authUpdate: any = {}

  if (updateUserDto.email && updateUserDto.email !== user.email) {
    authUpdate.email = updateUserDto.email
  }

  if (updateUserDto.password) {
    authUpdate.password = updateData.password 
  }

  if (Object.keys(authUpdate).length > 0) {
    await this.authModel.findOneAndUpdate(
      { email: user.email },
      { $set: authUpdate },
      { new: true }
    )
  }
  return await this.usersModel.findByIdAndUpdate(id, updateData, { new: true })
}


  async dow(id: string) {

    const user = await this.usersModel.findById(id)
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    if (user.isRoot) {
      throw new UnauthorizedException('no tienes autorizacion para actualizar este usuario')
    }
    return await this.usersModel.findByIdAndUpdate(id, { status: 'inactivo' });
  }
  async up(id: string) {
    const user = await this.usersModel.findById(id)
    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }
    if (user.isRoot) {
      throw new UnauthorizedException('no tienes autorizacion para actualizar este usuario')
    }
    return await this.usersModel.findByIdAndUpdate(id, { status: 'activo' })
  }
  async checkEmail(email: string) {
    return await this.usersModel.findOne({ email }) !== null;
  }

  async findGrade() {
    return await this.gradesModel.find();
  }
  async findPost() {
    return await this.postsModel.find();
  }

  async findOne(id: string) {
    return await this.usersModel.findById(id).select('-password')
  }

  async findByGrade(grade: string) {
    const grad = await this.gradesModel.findOne({ name: grade });

    if (!grad) {
      return null;
    }

    const sup = await this.usersModel
      .findOne({ grade: grad._id, status: 'activo' })
      .populate('grade');

    return sup;
  }


  async findRoles() {
    return await this.rolesModel.find({ isRoot: { $ne: true } })
  }
}
