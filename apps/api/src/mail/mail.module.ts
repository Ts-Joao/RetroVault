import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailerConfig } from './mailer.config';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [ConfigModule.forFeature(mailerConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}