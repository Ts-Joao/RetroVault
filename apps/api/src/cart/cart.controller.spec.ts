import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';

describe('CartController', () => {
    let controller: CartController;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule
        ({
            providers: [CartController],
        }).compile();

        controller = module.get<CartController>(CartController);
    });

    it('Should be defined', () => {
        expect(controller).toBeDefined();
    })
})