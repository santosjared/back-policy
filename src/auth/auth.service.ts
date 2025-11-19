import { Injectable, InternalServerErrorException, NotFoundException, Post, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientDocument } from 'src/clients/schema/clients.schema';
import { SingIn, SingInDocument } from './schema/sing-in.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Client.name) private readonly clienteService: Model<ClientDocument>,
    @InjectModel(SingIn.name) private readonly singIn: Model<SingInDocument>,
    private jwtService: JwtService
  ) { }
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.findUser(createAuthDto.email);
    if (user) {
      const userObj = user.toObject();
      const passwordHash = await bcrypt.compare(createAuthDto.password, userObj.password);
      if (passwordHash) {
        const payload = { sub: userObj._id }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        const isAuthenticated = await this.singIn.findOne({ userId: userObj._id });

        if (!isAuthenticated) {
          await this.singIn.create({ userId: userObj._id });
        } else {
          await this.singIn.findOneAndUpdate(
            { userId: userObj._id },
            { $set: { updatedAt: new Date() } }
          );
        }
        delete userObj.password
        return {
          access_token,
          refresh_token,
          user:userObj
        };
      }
      throw new UnauthorizedException('password incorect')
    }
    throw new UnauthorizedException('email incorect')
  }

  async findUser(param: string) {
    const isObjectId = Types.ObjectId.isValid(param);
    const query = isObjectId ? { _id: param } : { email: param };

    const user = await this.userService.findOne(query).populate([
      {
        path: 'rol',
        populate: {
          path: 'permissions',
        }
      },
      { path: 'grade' }
    ]);
    if (user) return user

    const client = await this.clienteService.findOne(query);
    if (client) return client;

    return null;
  }
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const getToken = await this.singIn.findOne({ userId: payload.sub });

      if (!getToken) {
        throw new UnauthorizedException('Token no válido');
      }

      const user = await this.findUser(payload.sub);

      const userObj = user.toObject();
      const access_token = this.jwtService.sign({ sub: userObj._id });
      const refresh_token = this.jwtService.sign(
        { sub: userObj._id },
        { expiresIn: '30d' },
      );
      delete userObj.password
      return {
        access_token,
        refresh_token,
        user:userObj
      };
    } catch (e) {
      console.error('Error en refresco de token: ', e);
      throw new UnauthorizedException('Token no válido');
    }
  }

  async logout(userId: string) {
    try {
      const remove = await this.singIn.findOneAndDelete({ userId });

      if (!remove) {
        throw new NotFoundException('Usuario no encontrado');
      }

      return remove;
    } catch (error) {

      console.error('Error en logout: ', error);
      throw new InternalServerErrorException('Hubo un error al cerrar sesión');
    }
  }

  async resetPassword(updateAuthDto: UpdateAuthDto) {
    try {
      const payload = this.jwtService.verify(updateAuthDto.token);
      const password = await bcrypt.hash(updateAuthDto.password, 10)
      const data = await this.clienteService.findOneAndUpdate({ email: payload.email }, { ...updateAuthDto, password, provider: 'local' })
      return { data }
    } catch (e) {
      console.log('Error al crear cliente: ', e)
      throw new UnauthorizedException('Token inválido');
    }
  }
}

