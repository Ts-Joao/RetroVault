import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesGuard } from './guard/roles.guard';
import { SelfOrAdminGuard } from './guard/owner-or-admin.guard';
import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '10m' }
      }),
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    RolesGuard,
    SelfOrAdminGuard,
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService
    }
  ],
  controllers: [AuthController],
  exports: [JwtModule, JwtStrategy, RolesGuard, SelfOrAdminGuard, HashingServiceProtocol]
})
export class AuthModule { }
