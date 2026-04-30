import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
    let service: CartService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule
        ({
            providers: [CartService],
        }).compile();

        service = module.get<CartService>(CartService);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    })
})