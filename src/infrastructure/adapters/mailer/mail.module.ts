import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { mailerConstants } from '../../constants/constants';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'Mail.ru',
        secure: false,
        auth: {
          user: mailerConstants.login,
          pass: mailerConstants.password,
        },
      },
      defaults: {
        from: 'Test <af.dmitr.test@mail.ru>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {
}