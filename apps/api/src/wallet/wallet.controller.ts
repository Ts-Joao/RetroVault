import { Body, Controller, Get, Headers, Patch } from '@nestjs/common';
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
    async getWallet(
        @Headers('user-id') headerUserId: string,
        @Body('userId') bodyUserId?: string,
    ) {
        return await this.service.get(headerUserId ?? bodyUserId)
    }

    @ApiOperation({ summary: 'Get wallet history' })
    @ApiResponse({ status: 200, description: 'Wallet history found successfully' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @Get('statement')
    async getHistory(
        @Headers('user-id') headerUserId: string,
        @Body('userId') bodyUserId?: string,
    ) {
        return await this.service.getHistory(headerUserId ?? bodyUserId)
    }

    @ApiOperation({ summary: 'Deposit to wallet' })
    @ApiResponse({ status: 200, description: 'Wallet deposited successfully' })
    @ApiResponse({ status: 404, description: 'Wallet not found' })
    @Patch('deposit')
    async deposit(
        @Headers('user-id') headerUserId: string,
        @Body('userId') bodyUserId: string,
        @Body() dto: DepositWalletDto,
    ) {
        return this.service.deposit(headerUserId ?? bodyUserId, dto)
    }
}
