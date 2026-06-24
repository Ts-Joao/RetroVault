import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { RolesGuard } from './guard/roles.guard';
import { SelfGuard } from './guard/self-guard.guard';
import { BcryptService } from './hash/bcrypt.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import jwtConfig from './config/jwt.config';
import { AuthTokenGuard } from './guard/auth-token.guard';
import { RefreshGuard } from './guard/refresh.guard';
import { PasswordResetService } from './services/password-reset.service';
import { PasswordResetController } from './controllers/password-reset.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: 3600 },
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
    AuthTokenGuard,
    RefreshGuard,
    PasswordResetService
  ],
  controllers: [AuthController, PasswordResetController],
  exports: [
    JwtModule,
    RolesGuard,
    SelfGuard,
    HashingServiceProtocol,
    AuthService,
    AuthTokenGuard,
    RefreshGuard,
  ],
})
export class AuthModule {}
