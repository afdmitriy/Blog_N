import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendUserConfirmation(userEmail: string, userName: string, token: string): Promise<void> {
    const url = `https://somesite.com/confirm-email?code=${token}`;

    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Welcome! Confirm your Email',
      template: './confirmation',
      context: {
        name: userName,
        url,
        token,
      },
    });
  }

  async sendPasswordRecovery(userEmail: string, userName: string, token: string): Promise<void> {
    const url = `https://somesite.com/reset-password?code=${token}`;
    await this.mailerService.sendMail({
      to: userEmail,
      subject: 'Password reset',
      template: './password.reset',
      context: {
        name: userName,
        url,
        token,
      },
    });
  }
}