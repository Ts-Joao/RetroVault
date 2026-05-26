import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import slugify from 'slugify';
import { HashingServiceProtocol } from 'src/auth/hash/hashing.service';
import { Role } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly hashingService: HashingServiceProtocol,
  ) {}

  private async generateSlug(name: string): Promise<string> {
    const base = slugify(name, { lower: true, strict: true });

    const existing = await this.databaseService.user.findUnique({
      where: { slug: base },
      select: { slug: true },
    });

    if (!existing) {
      return base;
    }

    const suffix = Math.random().toString(36).substring(2, 10);

    return `${base}-${suffix}`;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const userExists = await this.databaseService.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (userExists) {
        throw new NotFoundException('User already exists!');
      }

      const hashed = await this.hashingService.hash(createUserDto.password);
      const slug = await this.generateSlug(createUserDto.name);

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
      if (error instanceof NotFoundException) {
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
      if (error instanceof NotFoundException) {
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
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error getting user!');
    }
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    try {
      const findUser = await this.getById(userId);

      let passowrdHased = await this.hashPassword(
        updateUserDto.password,
        findUser.password,
      );

      if (updateUserDto.name && updateUserDto.name !== findUser.name) {
        findUser.slug = await this.generateSlug(updateUserDto.name);
      }

      const updateUser = await this.databaseService.user.update({
        where: { id: userId },
        data: {
          ...updateUserDto,
          password: passowrdHased,
          slug: findUser.slug,
        },
      });

      return updateUser;
    } catch (error) {
      throw new InternalServerErrorException('Error updating user!');
    }
  }

  async delete(userId: string) {
    try {
      const user = await this.getById(userId);

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
      throw new InternalServerErrorException('Error deleting user!');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null) {
    try {
      await this.getById(userId)

      if (!refreshToken) {
        const deleteRefreshToken = await this.databaseService.user.update({
          where: { id: userId },
          data: { refreshToken: null },
          select: { refreshToken: true },
        });

        return deleteRefreshToken.refreshToken
      }

      const refreshTokenHased = await this.hashingService.hash(refreshToken)

      const updateRefreshToken = await this.databaseService.user.update({
        where: { id: userId },
        data: { refreshToken: refreshTokenHased },
        select: { refreshToken: true },
      });

      return updateRefreshToken.refreshToken
    } catch (error) {
      throw new InternalServerErrorException('Error updating refresh token!');
    }
  }

  async updateRole(userId: string, updateRole: Role) {
    try {
      const user = await this.getById(userId);

      return this.databaseService.user.update({
        where: { id: userId },
        data: { role: updateRole },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error updating user role!');
    }
  }

  async hashPassword(
    password: string | undefined,
    passowrdHased: string,
  ): Promise<string> {
    return password ? await this.hashingService.hash(password) : passowrdHased;
  }
}
