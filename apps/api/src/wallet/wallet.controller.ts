import { Body, Controller, Get, Patch } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('wallet')
export class WalletController {
    constructor(private readonly service: WalletService) {}

    @ApiOperation({ summary: 'Get wallet by user ID' })
    @ApiResponse({ status: 200, description: 'Wallet found successfully' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @Get()
    async getWallet(@Body() {userId}: {userId: string}) {
        return await this.service.get(userId)
    }

    @ApiOperation({ summary: 'Get wallet history' })
    @ApiResponse({ status: 200, description: 'Wallet history found successfully' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @Get('statement')
    async getHistory(@Body() {userId}: {userId: string}) {
        return await this.service.getHistory(userId)
    }

    @ApiOperation({ summary: 'Deposit to wallet' })
    @ApiResponse({ status: 200, description: 'Wallet deposited successfully' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @Patch('deposit')
    async deposit(@Body() {userId}: {userId: string}, @Body() dto: DepositWalletDto) {
        return this.service.deposit(userId, dto)
    }
}
