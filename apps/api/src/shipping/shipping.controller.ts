import {
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common';
import { ShippingService } from './shipping.service';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import {
  ApiBody,
  ApiOperation,
  ApiResponse
} from '@nestjs/swagger';
import { PayloadDto } from 'src/auth/dto/payload.dto';

@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @ApiOperation({
    summary: 'Get shipping information',
    description: 'Get shipping information',
  })
  @ApiResponse({ status: 200, description: 'Shipping information',})
  @ApiBody({ type: String })
  @Get('/:cep')
  async getShipping(
    @Param('cep') cep: string,
    @CurrentUser() user?: PayloadDto
  ) {
    return await this.shippingService.calculateShipping(cep, user?.sub);
  }
}
