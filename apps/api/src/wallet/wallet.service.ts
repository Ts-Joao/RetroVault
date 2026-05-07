import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { DepositWalletDto } from './dto/deposit-wallet.dto';

@Injectable()
export class WalletService {
    constructor(private readonly databaseService: DatabaseService) {}

    async get(userId: string) {
        const wallet = await this.databaseService.wallet.findUnique({
            where: { userId }
        })

        if (!wallet) {
            throw new NotFoundException('Wallet Not Found!')
        }

        return wallet
    }

    async getHistory(userId: string) {
        const wallet = await this.get(userId)

        const history = await this.databaseService.walletTransaction.findMany({
            where: { walletId: wallet.id },
            orderBy: { createdAt: 'desc' }
        })

        return history
    }

    async deposit(userId: string, dto: DepositWalletDto) {
        const wallet = await this.get(userId)

        return this.databaseService.$transaction(async (tx) =>{
            const updated = await tx.wallet.update({
                where: { id: wallet.id },
                data: { balance: { increment: dto.amount } }
            })

            await tx.walletTransaction.create({
                data: {
                    type: 'DEPOSIT',
                    description: `Depósito de R$ ${dto.amount.toFixed(2)} realizado!`,
                    amount: dto.amount,
                    walletId: wallet.id
                }
            })

            return updated
        })
    }
}
