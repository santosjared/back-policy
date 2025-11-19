import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from 'src/clients/schema/clients.schema';
import { Model } from 'mongoose';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService,
    private readonly userService:UsersService,
    @InjectModel(Client.name) private readonly clientModel:Model<ClientDocument>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
  const user = await this.userService.findOne(payload.sub)||
  await this.clientModel.findById(payload.sub);
  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }
  return user;
}

}
