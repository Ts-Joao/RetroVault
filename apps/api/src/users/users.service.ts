import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import * as bcrypt from 'bcrypt'
import slugify from 'slugify';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

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
            const existUser = await this.databaseService.user.findUnique({
                where: { email: createUserDto.email }
            })

            if (existUser) {
                throw new HttpException('Email already exists',HttpStatus.CONFLICT)
            }

            const hashed = await bcrypt.hash(createUserDto.password, 12)

            const slug = await this.generateSlug(createUserDto.name);

            const user = await this.databaseService.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        ...createUserDto,
                        password: hashed,
                        slug: slug
                    }
                })
                
                const userWallet = await tx.wallet.create({
                    data: {
                        userId: newUser.id
                    }
                })

                const userCart = await tx.cart.create({
                    data: {
                        userId: newUser.id
                    }
                })

                return { newUser, userWallet, userCart }
            })

            return user
        } catch (error) {
            throw error
        }
    }

    async get() {
        try {
            const findUsers = await this.databaseService.user.findMany()

            return findUsers
        } catch (error) {
            throw new HttpException(
                'Error getting users!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getById(id: string) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            return findUser
        } catch (error) {
            throw new HttpException(
                'Error finding user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async getByEmail(email: string) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { email }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            return findUser
        } catch (error) {
            throw new HttpException(
                'Error finding user',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            let slug = findUser.slug;
            if (updateUserDto.name && updateUserDto.name !== findUser.name) {
                slug = await this.generateSlug(updateUserDto.name);
            }

            const updateUser = await this.databaseService.user.update({
                where: { id },
                data: {
                    ...updateUserDto,
                    slug
                }
            })

            return updateUser
        } catch (error) {
            throw new HttpException(
                'Error updating user!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async delete(id: string) {
        try {
            const findUser = await this.databaseService.user.findUnique({
                where: { id },
                include: {
                    wallet: true,
                    profilePic: true,
                    cart: true,
                }
            })

            if (!findUser) {
                throw new NotFoundException('User not found!')
            }

            const deleteUser = await this.databaseService.$transaction(async (tx) => {
                if (findUser.wallet) {
                    await tx.walletTransaction.deleteMany({ where: { walletId: findUser.wallet.id } })
                    await tx.wallet.delete({ where: { userId: id } })
                }
                if (findUser.cart) {
                    await tx.cart.delete({ where: { userId: id } })
                }
                if (findUser.profilePic) {
                    await tx.profilePhoto.delete({ where: { userId: id } })
                }

                return await tx.user.delete({
                    where: { id }
                })
            })

            return deleteUser
        } catch (error) {
            throw new HttpException(
                'Error deleting user!',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    async updateRefreshToken(userId: string, hash: string | null) {
        return this.databaseService.user.update({
            where: { id: userId },
            data: {refreshToken: hash}
        })
    }
}
