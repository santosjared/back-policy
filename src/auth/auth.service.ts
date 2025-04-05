import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Users, UsersDocument } from 'src/users/schema/users.schema';
import { JwtService } from '@nestjs/jwt';
import { Client, ClientDocumnet } from 'src/clients/schema/clients.schema';
import { SingIn, SingInDocument } from './schema/sing-in.schema';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Users.name) private readonly userService: Model<UsersDocument>,
    @InjectModel(Client.name) private readonly clienteService: Model<ClientDocumnet>,
    @InjectModel(SingIn.name) private readonly singIn: Model<SingInDocument>,
    private jwtService: JwtService
  ) { }
  async login(createAuthDto: CreateAuthDto) {
    const user = await this.findUser(createAuthDto.email);
    if (user) {
      const passwordHash = await bcrypt.compare(createAuthDto.password, user.password);
      if (passwordHash) {
        const payload = { sub: user._id }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        await this.singIn.create({ userId: user._id });
        return {
          access_token,
          refresh_token,
          userData: { name: user.name, lastName: user.lastName, email: user.email }
        };
      }
      throw new UnauthorizedException('password incorect')
    }
    throw new UnauthorizedException('email incorect')
  }

  async findUser(param: string) {
    const isObjectId = Types.ObjectId.isValid(param);
    const query = isObjectId ? { _id: param } : { email: param };
  
    const user = await this.userService.findOne(query);
    if (user) return user;
  
    const client = await this.clienteService.findOne(query);
    if (client) return client;
  
    return null;
  }
  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const getToken = this.singIn.findOne({ userId: payload.sub })

      if (!getToken) throw new BadRequestException('token no valido')

      const user = await this.findUser(payload.sub);

      const access_token = this.jwtService.sign({ sub: payload.sub })
      const refresh_token = this.jwtService.sign({ sub: payload.sub }, { expiresIn: '30d' })

      return { access_token, refresh_token, userData: { name: user.name, lastName: user.lastName, email: user.email } }

    } catch (e) {
      console.error('error en refresco de token: ', e);
      throw new BadRequestException('token no valido');
    }

  }
  async logout(userId: string) {
    const remove = await this.singIn.findOneAndDelete({ userId })
    if (remove) return remove
    throw new NotFoundException('user not found')
  }

}
