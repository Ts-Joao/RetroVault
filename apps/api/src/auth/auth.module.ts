import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
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

@Module({
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig), // <-- adiciona isso
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)], // <-- e aqui também
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
      useClass: BcryptService
    },
    AuthTokenGuard,
    RefreshGuard
  ],
  controllers: [AuthController],
  exports: [
    JwtModule,
    RolesGuard,
    SelfGuard,
    HashingServiceProtocol,
    AuthService,
    AuthTokenGuard,
    RefreshGuard
  ],
})
export class AuthModule {}
