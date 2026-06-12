import { registerAs } from '@nestjs/config';

export default registerAs(
  'jwt',
  (): {
    secret: string;
    refreshSecret: string;
    audience: string;
    issuer: string;
    ttl: string;
  } => {
    if (
      !process.env.JWT_ACCESS_SECRET ||
      !process.env.JWT_REFRESH_SECRET ||
      !process.env.JWT_TOKEN_AUDIENCE ||
      !process.env.JWT_TOKEN_ISSUER ||
      !process.env.JWT_TTL
    ) {
      throw new Error(
        'JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, JWT_TOKEN_AUDIENCE, JWT_TOKEN_ISSUER and JWT_TTL must be defined',
      );
    }

    return {
      secret: process.env.JWT_ACCESS_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      audience: process.env.JWT_TOKEN_AUDIENCE,
      issuer: process.env.JWT_TOKEN_ISSUER,
      ttl: process.env.JWT_TTL,
    };
  },
);
