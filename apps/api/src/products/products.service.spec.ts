import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './products.service';

describe('PostService', () => {
    let service: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ProductService],
        }).compile();

        service = module.get<ProductService>(ProductService);
    });

    it('Should be defined', () => {
        expect(service).toBeDefined();
    })
})
