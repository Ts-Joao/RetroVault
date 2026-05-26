import { registerAs } from '@nestjs/config';

export default registerAs('jwt', (): {
    secret: string;
    refreshSecret: string
    audience: string;
    issuer: string;
    ttl: string;
  } => {
    if (
      !process.env.JWT_SECRET ||
      !process.env.JWT_REFRESH_SECRET ||
      !process.env.JWT_AUDIENCE ||
      !process.env.JWT_ISSUER ||
      !process.env.JWT_TTL
    ) {
      throw new Error(
        'JWT_SECRET, JWT_AUDIENCE, JWT_ISSUER and JWT_TTL must be defined',
      );
    }

    return {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      audience: process.env.JWT_AUDIENCE,
      issuer: process.env.JWT_ISSUER,
      ttl: process.env.JWT_TTL,
    };
  }
);
