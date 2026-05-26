import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './guard/roles.guard';
import { SelfGuard } from './guard/self-guard.guard';
import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '10m' },
      }),
    }),
  ],
  providers: [
    AuthService,
    RolesGuard,
    SelfGuard,
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  controllers: [AuthController],
  exports: [
    JwtModule,
    RolesGuard,
    SelfGuard,
    HashingServiceProtocol
  ],
})
export class AuthModule {}
