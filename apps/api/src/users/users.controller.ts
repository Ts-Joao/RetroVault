import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { SelfGuard } from 'src/auth/guard/self-guard.guard';
import { Role } from '@prisma/client';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { TokenPayloadParam } from 'src/auth/param/token-payload.param';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }

  @Get()
  getUsers() {
    return this.usersService.get();
  }

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getById(id);
  }

  @Get('email')
  getUserByEmail(@Headers('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @UseGuards(AuthTokenGuard, SelfGuard || AdminGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: PayloadDto,
  ) {
    return this.usersService.update(id, updateUser, tokenPayload);
  }

  @UseGuards(AuthTokenGuard, AdminGuard)
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRole: Role,
    @TokenPayloadParam() tokenPayload: PayloadDto,
  ) {
    return this.usersService.updateRole(id, updateRole, tokenPayload);
  }

  @UseGuards(AuthTokenGuard, SelfGuard || AdminGuard)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string, @TokenPayloadParam() tokenPayload: PayloadDto) {
    return this.usersService.delete(id, tokenPayload);
  }
}
