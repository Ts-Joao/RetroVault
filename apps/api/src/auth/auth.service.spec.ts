import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import {
  UnauthorizedException,
  NotFoundException,
  HttpException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { HashingServiceProtocol } from './hash/hashing.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    getByEmail: jest.fn(),
    getById: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
  };

  const hashingServiceMock = {
    compare: jest.fn(),
    hash: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: HashingServiceProtocol,
          useValue: hashingServiceMock,
        },
      ],
    }).compile();

    service = module.get(AuthService);

    jest.clearAllMocks();
  });

  it('should login successfully', async () => {
    usersServiceMock.getByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'john@test.com',
      password: 'hashed-password',
      role: 'USER',
      name: 'John Doe',
      slug: 'john-doe',
    });

    usersServiceMock.getById.mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      slug: 'john-doe',
    });

    hashingServiceMock.compare.mockResolvedValue(true);

    jwtServiceMock.signAsync
      .mockResolvedValueOnce('access-token')
      .mockResolvedValueOnce('refresh-token');

    usersServiceMock.updateRefreshToken.mockResolvedValue(
      'hashed-refresh',
    );

    const result = await service.authenticate({
      email: 'john@test.com',
      password: '123456',
    });

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    usersServiceMock.getByEmail.mockResolvedValue({
      id: 'user-id',
      email: 'john@test.com',
      password: 'hashed-password',
    });

    usersServiceMock.getById.mockResolvedValue({
      id: 'user-id',
      name: 'John Doe',
      slug: 'john-doe',
    });

    hashingServiceMock.compare.mockResolvedValue(false);

    await expect(
      service.authenticate({
        email: 'john@test.com',
        password: 'wrong',
      }),
    ).rejects.toThrow(HttpException);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    usersServiceMock.getByEmail.mockRejectedValue(
      new NotFoundException(),
    );

    await expect(
      service.authenticate({
        email: 'john@test.com',
        password: '123456',
      }),
    ).rejects.toThrow(NotFoundException);
  });
});