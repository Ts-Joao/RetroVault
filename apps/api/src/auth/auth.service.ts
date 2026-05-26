import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from './hash/hashing.service';
import type { ConfigType } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import type { StringValue } from 'ms';
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
    private readonly hashingService: HashingServiceProtocol,

    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async authenticate(email: string, plainPassword: string) {
    const user = await this.usersService.getByEmail(email);

    const passwordMatch = await this.hashingService.compare(
      plainPassword,
      user.password,
    );

    if (!passwordMatch)
      throw new UnauthorizedException('Invalid credentials');

    await this.secretConfig();

    const tokens = await this.generateTokens(
      user.id,
      user.email,
      user.role,
      user.slug,
    );
    await this.saveRefreshToken(user.id, tokens.refresh_token);
    return { ...tokens, slug: user.slug };
  }

  async generateTokens(sub: string, email: string, role: Role, slug: string) {
    const tokenTtl = this.jwtConfiguration.ttl
    const expiresIn = tokenTtl
      ? /^\d+$/.test(tokenTtl)
        ? Number(tokenTtl)
        : (tokenTtl as StringValue)
      : undefined

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub,
          email,
          role,
          slug
        },
        {
          expiresIn: 900,
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer
        },
      ),
      this.jwtService.signAsync(
        {
          sub,
          email,
          role,
          slug
        },
        {
          expiresIn,
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer
        },
      ),
    ]);

    return { access_token, refresh_token };
  }

  async saveRefreshToken(userId: string, refresh_token: string) {
    const hash = await bcrypt.hash(refresh_token, 12);
    return this.usersService.updateRefreshToken(userId, hash);
  }

  async logout(userId: string) {
    return this.usersService.updateRefreshToken(userId, null);
  }

  private async secretConfig() {
    if (!this.jwtConfiguration.secret) {
      throw new InternalServerErrorException('JWT secrets are not configured')
    }

    return this.jwtConfiguration.secret
  }
}
