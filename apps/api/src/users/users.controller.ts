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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post()
  createUser(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @Get()
  getUsers() {
    return this.usersService.get();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getById(id);
  }

  @ApiOperation({ summary: 'Get user by email' })
  @ApiResponse({ status: 200, description: 'User found successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('email')
  getUserByEmail(@Headers('email') email: string) {
    return this.usersService.getByEmail(email);
  }

  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard, SelfGuard)
  @ApiOperation({ summary: 'Update user' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id')
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUser: UpdateUserDto,
    @TokenPayloadParam() tokenPayload: PayloadDto,
  ) {
    return this.usersService.update(id, updateUser, tokenPayload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard, AdminGuard)
  @ApiOperation({ summary: 'Update user role' })
  @ApiBody({ enum: Role })
  @ApiResponse({ status: 200, description: 'User role updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Patch(':id/role')
  updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRole: Role,
    @TokenPayloadParam() tokenPayload: PayloadDto,
  ) {
    return this.usersService.updateRole(id, updateRole, tokenPayload);
  }

  @ApiBearerAuth()
  @UseGuards(AuthTokenGuard, SelfGuard)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Delete(':id')
  deleteUser(
    @Param('id', ParseUUIDPipe) id: string,
    @TokenPayloadParam() tokenPayload: PayloadDto,
  ) {
    return this.usersService.delete(id, tokenPayload);
  }
}
