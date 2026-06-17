import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { DatabaseService } from 'src/database/database.service';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CouponType } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CouponService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService
  ) {}

  async create(createCouponDto: CreateCouponDto) {
    try {
      return await this.databaseService.coupon.create({
        data: createCouponDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to create coupon');
    }
  }

  async findAll() {
    try {
      return await this.databaseService.coupon.findMany();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to list coupons');
    }
  }

  async findOne(code: string) {
    try {
      const coupon = await this.databaseService.coupon.findUnique({
        where: { code },
      });

      if (!coupon) throw new NotFoundException('Coupon not found');

      return coupon;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to find coupon');
    }
  }

  async update(code: string, updateCouponDto: UpdateCouponDto) {
    try {
      await this.findOne(code);

      return await this.databaseService.coupon.update({
        where: { code },
        data: updateCouponDto,
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to update coupon');
    }
  }

  async remove(code: string) {
    try {
      await this.findOne(code);

      return await this.databaseService.coupon.delete({
        where: { code },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to remove coupon');
    }
  }

  async validateCoupon(code: string, orderTotal: number, userId: string) {
    try {
      const coupon = await this.findOne(code);
      await this.usersService.getById(userId);
      await this.isActive(code);
      await this.isNotExpired(code);
      await this.alreadyUsed(code, userId);

      let discount: number = 0;

      if(coupon.type === CouponType.PERCENTAGE){
        discount = orderTotal * Number(coupon.value) / 100;

      }

      if (coupon.type === CouponType.FIXED){
        discount = Number(coupon.value);
      }

      console.log({
        orderTotal,
        orderTotalType: typeof orderTotal,
        couponValue: coupon.value,
        couponValueType: typeof coupon.value,
      });
      
      return  {
        coupon,
        discount,
        total: Math.max(0, orderTotal - discount)
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to validate coupon');
    }
  }

  async useCoupon(code: string, orderId: string, userId: string) {
    try {
      const coupon = await this.findOne(code);
      await this.usersService.getById(userId);
      await this.isActive(code);
      await this.isNotExpired(code);
      await this.alreadyUsed(code, userId);

      return await this.databaseService.couponUsage.create({
        data: {
          couponId: coupon.id,
          userId,
          orderId,
        },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to use coupon');
    }
  }

  async usageCoupon(couponId: string) {
    try {
      await this.findOne(couponId);

      return await this.databaseService.couponUsage.count({
        where: { couponId },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to use coupon');
    }
  }

  private async isActive(couponId: string) {
    try {
      const coupon = await this.findOne(couponId);

      if (!coupon.isActive) {
        throw new BadRequestException('Coupon is not active');
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to check coupon');
    }
  }

  private async isNotExpired(couponId: string) {
    try {
      const coupon = await this.findOne(couponId);

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Coupon is expired');
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to check coupon');
    }
  }

  private async alreadyUsed(couponId: string, userId: string) {
    try {
      const coupon = await this.findOne(couponId);
      const alreadyUsed = await this.databaseService.couponUsage.count({
        where: {
          couponId: coupon.id,
          userId,
        },
      });

      if (coupon.maxUses && coupon.maxUses <= alreadyUsed) {
        throw new BadRequestException('Coupon has been used');
      }

      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error to check coupon');
    }
  }
}
