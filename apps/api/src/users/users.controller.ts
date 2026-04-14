import { Body, Controller, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
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

    @Patch(':id')
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: UpdateUserDto) {
        return this.usersService.update(id, updateUser)
    }
}
