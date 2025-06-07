import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';
import getConfig from 'src/config/environment'

@Injectable()
export class MailService {
    private resend: Resend;
    constructor(){
       this.resend = new Resend(getConfig().RESEND_API_KEY);
    }

    async sendMail(to: string, code: number) {
      try {
      const { data, error } = await this.resend.emails.send({
        from: getConfig().RESEND_FROM_EMAIL,
        to,
        subject: 'Código de verificación',
        html: `<h2>Radio patrulla 110 Potosí</h2>
        <p>Tu código de verificación es: <strong>${code}</strong></p>`,
      });

      if (error) {
        console.error('Error al enviar correo:', error);
        throw new Error('No se pudo enviar el correo');
      }

      return data;
    } catch (err) {
      throw err;
    }
  }
}