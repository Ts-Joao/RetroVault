import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { SelfOrAdminGuard } from 'src/auth/guard/owner-or-admin.guard';
import { AuthGuard } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { AdminGuard } from 'src/common/guards/admin.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    createUser(@Body() createUser: CreateUserDto) {
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
    @UseGuards(AuthGuard('jwt'), SelfOrAdminGuard)
    updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUser: UpdateUserDto) {
        return this.usersService.update(id, updateUser)
    }

    @UseGuards(AuthGuard('jwt'), AdminGuard)
    @Patch(':id/role')
    updateRole(@Param('id', ParseUUIDPipe) id: string, @Body() updateRole: Role) {
        return this.usersService.updateRole(id, updateRole)
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), SelfOrAdminGuard)
    deleteUser(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.delete(id)
    }
}
