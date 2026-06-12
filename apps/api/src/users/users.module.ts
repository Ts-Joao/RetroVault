import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { CommonModule } from 'src/common/common.module';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    WalletModule,
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
