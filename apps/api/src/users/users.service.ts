import {
  ConflictException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { Role } from '@prisma/client';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingServiceProtocol,
    private readonly slugService: SlugServiceProtocol
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (userExists) {
        throw new ConflictException('Email already in use!');
      }

      const hashed = await this.hashingService.hash(createUserDto.password);
      const slug = await this.slugService.generateSlug(createUserDto.name, 'user');

      const addUser = await this.databaseService.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            ...createUserDto,
            password: hashed,
            slug: slug,
          },
        });

        const userWallet = await tx.wallet.create({
          data: {
            userId: newUser.id,
          },
        });

        const userCart = await tx.cart.create({
          data: {
            userId: newUser.id,
          },
        });

        const userPhoto = await tx.profilePhoto.create({
          data: {
            userId: newUser.id,
            url: '',
          },
        });

        return { newUser, userWallet, userCart, userPhoto };
      });

      return addUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error creating user!');
    }
  }

  async get() {
    try {
      const findUsers = await this.databaseService.user.findMany();

      return findUsers;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting users!');
    }
  }

  async getById(userId: string) {
    try {
      const findUser = await this.databaseService.user.findUnique({
        where: { id: userId },
        include: {
          wallet: true,
          profilePic: true,
          cart: true,
        },
      });

      if (!findUser) {
        throw new NotFoundException('User not found!');
      }

      return findUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting user!');
    }
  }

  async getByEmail(email: string) {
    try {
      const findUser = await this.databaseService.user.findUnique({
        where: { email },
      });

      if (!findUser) {
        throw new NotFoundException('User not found!');
      }

      return findUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting user!');
    }
  }

  async update(
    userId: string,
    updateUserDto: UpdateUserDto,
    tokenPayload: PayloadDto,
  ) {
    try {
      const findUser = await this.getById(userId);

      if (tokenPayload.sub !== userId) {
        throw new ForbiddenException(
          'You are not authorized to update this user!',
        );
      }

      const passwordHased = await this.hashPassword(
        updateUserDto.password,
        findUser.password,
      );

      const slug = await this.slugService.adjustSlug(
        findUser.name,
        updateUserDto.name,
        findUser.slug,
        'user'
      );

      const updateUser = await this.databaseService.user.update({
        where: { id: userId },
        data: {
          ...updateUserDto,
          password: passwordHased,
          slug,
        },
      });

      return updateUser;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating user!');
    }
  }

  async delete(userId: string, tokenPayload: PayloadDto) {
    try {
      const user = await this.getById(userId);

      if (tokenPayload.sub !== user.id || tokenPayload.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You are not authorized to delete this user!',
        );
      }

      return this.databaseService.$transaction(async (tx) => {
        const deleteOperations = [
          user.wallet && tx.wallet.delete({ where: { userId } }),
          user.cart && tx.cart.delete({ where: { userId } }),
          user.profilePic && tx.profilePhoto.delete({ where: { userId } }),
        ].filter((op) => op !== null);

        await Promise.all(deleteOperations);

        return tx.user.delete({
          where: { id: userId },
        });
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error deleting user!');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      await this.getById(userId);

      if (!refreshToken) {
        const deleteRefreshToken = await this.databaseService.user.update({
          where: { id: userId },
          data: { refreshToken: null },
          select: { refreshToken: true },
        });

        return deleteRefreshToken.refreshToken;
      }

      const refreshTokenHased = await this.hashingService.hash(refreshToken);

      const updateRefreshToken = await this.databaseService.user.update({
        where: { id: userId },
        data: { refreshToken: refreshTokenHased },
        select: { refreshToken: true },
      });

      return updateRefreshToken.refreshToken;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating refresh token!');
    }
  }

  async updateRole(userId: string, updateRole: Role, tokenPayload: PayloadDto) {
    try {
      await this.getById(userId);

      if (tokenPayload.role !== 'ADMIN') {
        throw new ForbiddenException(
          'You are not authorized to update this user!',
        );
      }

      return this.databaseService.user.update({
        where: { id: userId },
        data: { role: updateRole },
        select: { role: true },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error updating user role!');
    }
  }

  async hashPassword(
    password: string | undefined,
    passowrdHased: string,
  ): Promise<string> {
    return password ? await this.hashingService.hash(password) : passowrdHased;
  }

  async verifyIsSeller(sellerId: string) {
    try {
      const seller = await this.getById(sellerId);

      if (seller.role !== 'SELLER') {
        throw new UnauthorizedException('User is not a seller');
      }

      return seller;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error checking if user is a seller!',
      );
    }
  }
}
