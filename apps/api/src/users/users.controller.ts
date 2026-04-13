import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly UsersService: UsersService) {}

    @Post()
    createUser(@Body() createUser: CreateUserDto){
        return this.UsersService.create(createUser)
    }
}
