import { Body, Controller, Get, Patch } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';

@Controller('wallet')
export class WalletController {
    constructor(private readonly service: WalletService) {}

    @Get()
    async getWallet(@Body() {userId}: {userId: string}) {
        return await this.service.get(userId)
    }

    @Get('statement')
    async getHistory(@Body() {userId}: {userId: string}) {
        return await this.service.getHistory(userId)
    }

    @Patch('deposit')
    async deposit(@Body() {userId}: {userId: string}, @Body() dto: DepositWalletDto) {
        return this.service.deposit(userId, dto)
    }
}
