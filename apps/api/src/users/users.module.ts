import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { CommonModule } from 'src/common/common.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    WalletModule,
    CommonModule,
    MailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
