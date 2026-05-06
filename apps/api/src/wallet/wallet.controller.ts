import { Controller, Get, Patch } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';

@Controller('wallet')
export class WalletController {
    constructor(private readonly service: WalletService) {}

    @Get()
    async getWallet(userId: string) {
        return await this.service.get(userId)
    }

    @Get('statement')
    async getHistory(userId: string) {
        return await this.service.getHistory(userId)
    }

    @Patch('deposit')
    async deposit(userId: string, dto: DepositWalletDto) {
        return this.service.deposit(userId, dto)
    }
}
