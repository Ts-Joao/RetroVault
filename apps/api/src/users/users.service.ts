import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const existUser = await this.databaseService.user.findUnique({
                where: { email: createUserDto.email }
            })

            if (existUser) {
                throw new HttpException('Email already exists',HttpStatus.CONFLICT)
            }

            const hashed = await bcrypt.hash(createUserDto.password, 12)

            const user = await this.databaseService.$transaction(async (tx) => {
                const newUser = await tx.user.create({
                    data: {
                        ...createUserDto,
                        password: hashed
                    }
                })
                
                await tx.wallet.create({
                    data: {
                        userId: newUser.id
                    }
                })

                return newUser
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

            const updateUser = await this.databaseService.user.update({
                where: { id },
                data: updateUserDto
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
                    await tx.photo.delete({ where: { userId: id } })
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
