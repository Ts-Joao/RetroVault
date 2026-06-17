import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Patch,
  Delete
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { PayloadDto } from 'src/auth/dto/payload.dto';
import { AuthTokenGuard } from 'src/auth/guard/auth-token.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@UseGuards(AuthTokenGuard)
@ApiBearerAuth()
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createCouponDto: CreateCouponDto) {
    return this.couponService.create(createCouponDto);
  }

  @Post('validate')
  validateCoupon(
    @Body() dto: ValidateCouponDto,
    @CurrentUser() user: PayloadDto,
  ) {
    return this.couponService.validateCoupon(dto.code, dto.orderTotal, user.sub);
  }

  @Post('use/:code')
  useCoupon(
    @Param('code') code: string,
    @Body('orderId') orderId: string,
    @CurrentUser() user: PayloadDto,
  ) {
    return this.couponService.useCoupon(code, orderId, user.sub);
  }

  @Get()
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.couponService.findOne(code);
  }

  @Patch(':code')
  @UseGuards(AdminGuard)
  update(
    @Param('code') code: string,
    @Body() updateCouponDto: UpdateCouponDto
  ) {
    return this.couponService.update(code, updateCouponDto);
  }

  @Delete(':code')
  @UseGuards(AdminGuard)
  remove(@Param('code') code: string) {
    return this.couponService.remove(code);
  }
}
