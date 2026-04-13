import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDto } from './dto/create.user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            const newUser = await this.databaseService.user.create({
                data: {
                    name: createUserDto.name,
                    email: createUserDto.email,
                    password: createUserDto.password
                }
            })
            return newUser
        } catch (error) {
            throw error
        }
    }
}
