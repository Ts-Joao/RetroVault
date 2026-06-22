import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { PasswordResetService } from '../services/password-reset.service';
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
  VerifyResetCodeDto,
} from '../dto/password-reset.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class PasswordResetController {
  constructor(private readonly passwordResetService: PasswordResetService) {}

  @ApiOperation({ summary: 'Request password reset' })
  @ApiResponse({ status: 204, description: 'Password reset requested successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('password-reset/request')
  @HttpCode(HttpStatus.NO_CONTENT)
  async requestReset(@Body() dto: RequestPasswordResetDto): Promise<void> {
    await this.passwordResetService.requestReset(dto);
  }

  @ApiOperation({ summary: 'Verify reset code' })
  @ApiResponse({ status: 200, description: 'Code verified successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('password-reset/verify')
  async verifyCode(@Body() dto: VerifyResetCodeDto): Promise<{ resetToken: string }> {
    return this.passwordResetService.verifyCode(dto);
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiResponse({ status: 204, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @Post('password-reset/confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.passwordResetService.resetPassword(dto);
  }
}