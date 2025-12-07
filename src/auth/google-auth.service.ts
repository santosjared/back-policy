import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Client, ClientDocument } from 'src/clients/schema/clients.schema';
import { GOOGLE_TOKEN_INFO_URL } from 'src/config/google.config';
import { SingIn, SingInDocument } from './schema/sing-in.schema';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { AuthGoogleDto } from './dto/auth-google.dto';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectModel(Client.name) private readonly clientService: Model<ClientDocument>,
    @InjectModel(SingIn.name) private readonly singIn: Model<SingInDocument>,
    @InjectModel(Rol.name) private readonly rolService: Model<RolDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async verifyIdToken(idToken: AuthGoogleDto): Promise<any> {
    let payload: any;

    try {
      const { data } = await axios.get(`${GOOGLE_TOKEN_INFO_URL}?id_token=${idToken.token}`);
      payload = data;
    } catch {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    if (!payload?.email_verified) {
      throw new UnauthorizedException('Email no verificado');
    }

    const existingUser = await this.clientService.findOne({ email: payload.email });

    let user: ClientDocument;
    if (existingUser) {
      user = await this.clientService.findByIdAndUpdate(
        existingUser._id,
        { provider: 'google' },
        { new: true }
      );
    } else {
      const data = {
        name: payload.given_name || '',
        lastName: payload.family_name || '',
        email: payload.email,
        picture: payload.picture || '',
        phone: payload.phone || '',
        provider: 'google',
      };
      user = await this.clientService.create(data);
    }

    if (!user) throw new UnauthorizedException('Error al registrar usuario');

    return this.signUser(user);
  }

  private async signUser(user: ClientDocument) {
    const payload = { sub: user._id };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });

    await this.singIn.findOneAndUpdate(
      { userId: user._id },
      { $set: { updatedAt: new Date() } },
      { upsert: true }
    );

    const userObj = user.toObject ? user.toObject() : user;

    return {
      access_token,
      refresh_token,
      user: userObj,
    };
  }
}
