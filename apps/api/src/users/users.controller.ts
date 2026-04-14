import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() createUser: CreateUserDto){
        return this.usersService.create(createUser)
    }

    @Get()
    getUsers() {
        return this.usersService.get()
    }

    @Get(':id')
    getUserById(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.getById(id)
    }

    @Patch(':id')
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: UpdateUserDto) {
        return this.usersService.update(id, updateUser)
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.delete(id)
    }
}
