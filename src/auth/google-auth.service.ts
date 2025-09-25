import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { Client, ClientDocumnet } from 'src/clients/schema/clients.schema';
import { GOOGLE_TOKEN_INFO_URL } from 'src/config/google.config';
import { SingIn, SingInDocument } from './schema/sing-in.schema';
import { Rol, RolDocument } from 'src/roles/schema/roles.schema';
import { Roles } from 'src/constants/roles.constants';
import { AuthGoogleDto } from './dto/auth-google.dto';

@Injectable()
export class GoogleAuthService {
    constructor(@InjectModel(Client.name) private readonly clientService: Model<ClientDocumnet>,
        @InjectModel(SingIn.name) private readonly singIn: Model<SingInDocument>,
        @InjectModel(Rol.name) private readonly rolService: Model<RolDocument>,
         private jwtService: JwtService,
    ) { }
    async verifyIdToken(idToken: AuthGoogleDto): Promise<any> {
        const response = await axios.get(`${GOOGLE_TOKEN_INFO_URL}?id_token=${idToken.token}`);
        const payload = response.data;
        if (!payload || !payload.email_verified) {
            throw new UnauthorizedException('Token inválido o email no verificado');
        }

        if (payload) {
            const user = await this.clientService.findOne({ email: payload.email });
            if (user) {
                return await this.singUser(user)
            } else {
                const data = {
                    name: payload.given_name||'',
                    lastName: payload.family_name||'',
                    email: payload.email,
                    picture: payload.picture||'',
                    phone: payload.phone||'',
                }
                const rol = await this.rolService.findOne({ name: Roles.CLIENT })
                const user = await this.clientService.create({ ...data, rol: rol._id, provider: 'google' });
                return await this.singUser(user);
            }
        }
        throw new UnauthorizedException('token no valido')

    }
    private async singUser(user: ClientDocumnet) {
        const payload = { sub: user._id }
        const access_token = this.jwtService.sign(payload);
        const refresh_token = this.jwtService.sign(payload, { expiresIn: '30d' });
        const isAuthenticated = await this.singIn.findOne({ userId: user._id });
        if (!isAuthenticated) {
            await this.singIn.create({ userId: user._id });
        } else {
            await this.singIn.findOneAndUpdate(
                { userId: user._id },
                { $set: { updatedAt: new Date() } }
            );
        }
        delete user.password
        return {
            access_token,
            refresh_token,
            user,
        };
    }
}
