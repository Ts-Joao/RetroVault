import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

import { UsersService } from './users.service';
import { DatabaseService } from 'src/database/database.service';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';

describe('UsersService', () => {
  let service: UsersService;

  const databaseMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    wallet: {
      delete: jest.fn(),
    },
    cart: {
      delete: jest.fn(),
    },
    profilePhoto: {
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const hashingMock = {
    hash: jest.fn(),
    compare: jest.fn(),
  };

  const slugMock = {
    generateSlug: jest.fn(),
    adjustSlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: DatabaseService,
          useValue: databaseMock,
        },
        {
          provide: HashingServiceProtocol,
          useValue: hashingMock,
        },
        {
          provide: SlugServiceProtocol,
          useValue: slugMock,
        },
      ],
    }).compile();

    service = module.get(UsersService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      databaseMock.user.findUnique.mockResolvedValue(null);

      hashingMock.hash.mockResolvedValue('hashed-password');

      slugMock.generateSlug.mockResolvedValue('john-doe');

      databaseMock.$transaction.mockImplementation(async (callback) => {
        return callback({
          user: {
            create: jest.fn().mockResolvedValue({
              id: 'user-id',
              email: 'john@test.com',
            }),
          },
          wallet: {
            create: jest.fn().mockResolvedValue({}),
          },
          cart: {
            create: jest.fn().mockResolvedValue({}),
          },
          profilePhoto: {
            create: jest.fn().mockResolvedValue({}),
          },
        });
      });

      const result = await service.create({
        name: 'John Doe',
        email: 'john@test.com',
        password: '123456',
        phone: '999999999',
      });

      expect(result.newUser.id).toBe('user-id');
    });

    it('should throw ConflictException when email exists', async () => {
      databaseMock.user.findUnique.mockResolvedValue({
        id: '1',
      });

      await expect(
        service.create({
          name: 'John',
          email: 'john@test.com',
          password: '123456',
          phone: '999999999',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('get', () => {
    it('should return all users', async () => {
      databaseMock.user.findMany.mockResolvedValue([
        { id: '1' },
        { id: '2' },
      ]);

      const result = await service.get();

      expect(result).toHaveLength(2);
    });
  });

  describe('getById', () => {
    it('should return user', async () => {
      databaseMock.user.findUnique.mockResolvedValue({
        id: '1',
      });

      const result = await service.getById('1');

      expect(result.id).toBe('1');
    });

    it('should throw NotFoundException', async () => {
      databaseMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getByEmail', () => {
    it('should return user by email', async () => {
      databaseMock.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'john@test.com',
      });

      const result = await service.getByEmail('john@test.com');

      expect(result.email).toBe('john@test.com');
    });

    it('should throw NotFoundException', async () => {
      databaseMock.user.findUnique.mockResolvedValue(null);

      await expect(
        service.getByEmail('john@test.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const user = {
      id: '1',
      name: 'John',
      slug: 'john',
      password: 'hashed-password',
    };

    beforeEach(() => {
      jest.spyOn(service, 'getById').mockResolvedValue(user as any);
    });

    it('should update user', async () => {
      slugMock.adjustSlug.mockResolvedValue('john-updated');

      databaseMock.user.update.mockResolvedValue({
        ...user,
        name: 'Updated',
      });

      const result = await service.update(
        '1',
        {
          name: 'Updated',
        },
        {
          sub: '1',
          email: 'user@test.com',
          iat: 1,
          exp: 9999999999,
          aud: 'users',
          iss: 'auth',
          role: Role.USER,
        }
      );

      expect(result.name).toBe('Updated');
    });

    it('should throw ForbiddenException', async () => {
      await expect(
        service.update(
          '1',
          {},
          {
            sub: 'another-user',
            email: 'user@test.com',
            iat: 1,
            exp: 9999999999,
            aud: 'users',
            iss: 'auth',
            role: Role.USER,
          }
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should update password', async () => {
      hashingMock.compare.mockResolvedValue(true);
      hashingMock.hash.mockResolvedValue('new-hashed-password');

      slugMock.adjustSlug.mockResolvedValue('john');

      databaseMock.user.update.mockResolvedValue({
        ...user,
      });

      await service.update(
        '1',
        {
          password: 'old-password',
          newPassword: 'new-password',
        },
        {
          sub: '1',
          email: 'user@test.com',
          iat: 1,
          exp: 9999999999,
          aud: 'users',
          iss: 'auth',
          role: Role.USER,
        }
      );

      expect(hashingMock.compare).toHaveBeenCalled();
      expect(hashingMock.hash).toHaveBeenCalledWith(
        'new-password',
      );
    });

    it('should throw BadRequestException when current password is missing', async () => {
      await expect(
        service.update(
          '1',
          {
            newPassword: 'new-password',
          },
          {
            sub: '1',
            email: 'user@test.com',
            iat: 1,
            exp: 9999999999,
            aud: 'users',
            iss: 'auth',
            role: Role.USER,
          }
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when current password is invalid', async () => {
      hashingMock.compare.mockResolvedValue(false);

      await expect(
        service.update(
          '1',
          {
            password: 'wrong',
            newPassword: 'new-password',
          },
          {
            sub: '1',
            email: 'user@test.com',
            iat: 1,
            exp: 9999999999,
            aud: 'users',
            iss: 'auth',
            role: Role.USER,
          }
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateRefreshToken', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getById').mockResolvedValue({
        id: '1',
      } as any);
    });

    it('should save refresh token', async () => {
      hashingMock.hash.mockResolvedValue('hashed-refresh');

      databaseMock.user.update.mockResolvedValue({
        refreshToken: 'hashed-refresh',
      });

      const result = await service.updateRefreshToken(
        '1',
        'refresh-token',
      );

      expect(result).toBe('hashed-refresh');
    });

    it('should remove refresh token', async () => {
      databaseMock.user.update.mockResolvedValue({
        refreshToken: null,
      });

      const result = await service.updateRefreshToken(
        '1',
        null,
      );

      expect(result).toBeNull();
    });
  });

  describe('updateRole', () => {
    beforeEach(() => {
      jest.spyOn(service, 'getById').mockResolvedValue({
        id: '1',
      } as any);
    });

    it('should update role when admin', async () => {
      databaseMock.user.update.mockResolvedValue({
        role: Role.ADMIN,
      });

      const result = await service.updateRole(
        '1',
        Role.ADMIN,
        {
          sub: 'admin-id',
          email: 'admin@test.com',
          iat: 1,
          exp: 9999999999,
          aud: 'users',
          iss: 'auth',
          role: Role.ADMIN,
        }
      );

      expect(result.role).toBe(Role.ADMIN);
    });

    it('should throw ForbiddenException', async () => {
      await expect(
        service.updateRole(
          '1',
          Role.ADMIN,
          {
            sub: '1',
            email: 'user@test.com',
            iat: 1,
            exp: 9999999999,
            aud: 'users',
            iss: 'auth',
            role: Role.USER,
          }
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('hashPassword', () => {
    it('should hash password', async () => {
      hashingMock.hash.mockResolvedValue('hashed');

      const result = await service.hashPassword(
        '123456',
        'old',
      );

      expect(result).toBe('hashed');
    });

    it('should return current password when undefined', async () => {
      const result = await service.hashPassword(
        undefined,
        'current-password',
      );

      expect(result).toBe('current-password');
    });
  });
});