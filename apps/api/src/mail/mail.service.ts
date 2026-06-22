import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import {
  welcomeTemplate,
  WelcomeEmailData,
} from './templates/welcome.template';

import {
  passwordResetTemplate,
  PasswordResetEmailData,
} from './templates/password-reset.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('mailer.host'),
      port: this.config.get<number>('mailer.port'),
      secure: this.config.get<boolean>('mailer.secure'),
      auth: {
        user: this.config.get<string>('mailer.user'),
        pass: this.config.get<string>('mailer.pass'),
      },
    });
  }

  async sendWelcome(data: WelcomeEmailData): Promise<void> {
    const from = this.config.get<string>('mailer.from');

    try {
      const info = await this.transporter.sendMail({
        from,
        to: data.email,
        subject: `Bem-vindo à RetroVault, ${data.name}! 🎮`,
        html: welcomeTemplate(data),
      });

      this.logger.log(`E-mail de boas-vindas enviado → ${data.email} [${info.messageId}]`);
    } catch (error) {
      this.logger.error(
        `Falha ao enviar e-mail de boas-vindas para ${data.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async sendPasswordReset(data: PasswordResetEmailData): Promise<void> {
    const from = this.config.get<string>('mailer.from');
  
    try {
      const info = await this.transporter.sendMail({
        from,
        to: data.email,
        subject: `Seu código de redefinição de senha — RetroVault`,
        html: passwordResetTemplate(data),
      });
  
      this.logger.log(
        `E-mail de reset enviado → ${data.email} [${info.messageId}]`,
      );
    } catch (error) {
      this.logger.error(
        `Falha ao enviar e-mail de reset para ${data.email}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}