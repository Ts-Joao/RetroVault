import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ShippingService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly usersService: UsersService
  ) {}

  async calculateShipping(cep: string, userId?: string) {
    try {
      const cleanCep = await this.verifyCep(cep);

      const address = await this.verifyAddress(cleanCep);

      if (userId) {
        await this.usersService.getById(userId)

        await this.databaseService.user.update({
          where: {id: userId},
          data: {defaultCep: cleanCep}
        })
      }

      const multiplier = this.getRegionMultiplier(address.uf);

      return {
        cep: cleanCep,
        city: address.localidade,
        state: address.uf,

        pac: {
          name: 'PAC',
          price: Number((12 * multiplier).toFixed(2)),
          deadline: Math.ceil(5 * multiplier),
        },

        sedex: {
          name: 'SEDEX',
          price: Number((20 * multiplier).toFixed(2)),
          deadline: Math.max(
            1,
            Math.ceil(2 * multiplier)
          )
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding cep');
    }
  }

  async verifyCep(cep: string) {
    try {
      const cleanCep = cep.replace(/\D/g, '');

      if (cleanCep.length !== 8) {
        throw new BadRequestException('Invalid cep');
      }

      return cleanCep;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding cep');
    }
  }

  async verifyAddress(cep: string) {
    try {
      const address = await this.viaCep(cep);

      if (address.erro) {
        throw new BadRequestException('Cep not found');
      }

      return address;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding address');
    }
  }

  async viaCep(cep: string) {
    try {
      const response = await fetch(`http://www.viacep.com.br/ws/${cep}/json/`);

      if (!response.ok) {
        throw new BadRequestException('Error finding cep');
      }

      return response.json();
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Error finding cep');
    }
  }

  private getRegionMultiplier(uf: string) {
    const regions: Record<string, number> = {
      "AC": 1.10,
      "AL": 1.17,
      "AP": 1.25,
      "AM": 1.20,
      "BA": 1.15,
      "CE": 1.12,
      "DF": 1.08,
      "ES": 1.10,
      "GO": 1.12,
      "MA": 1.18,
      "MT": 1.14,
      "MS": 1.14,
      "MG": 1.05,
      "PA": 1.22,
      "PB": 1.17,
      "PR": 1.05,
      "PE": 1.17,
      "PI": 1.20,
      "RJ": 1.03,
      "RN": 1.15,
      "RS": 1.07,
      "RO": 1.25,
      "RR": 1.28,
      "SC": 1.05,
      "SP": 1.02,
      "SE": 1.16,
      "TO": 1.18,
    }

    return regions[uf] || 1.30;
  }
}
