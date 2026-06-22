import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '@prisma/client';

import { ProductService } from './products.service';
import { DatabaseService } from 'src/database/database.service';
import { ShippingService } from 'src/shipping/shipping.service';
import { SlugServiceProtocol } from 'src/common/utils/slug/slug.service';

describe('ProductService', () => {
  let service: ProductService;

  const databaseMock = {
    user: {
      findUnique: jest.fn(),
    },
    product: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    mediaType: {
      findMany: jest.fn(),
    },
  };

  const slugMock = {
    generateSlug: jest.fn(),
  };

  const shippingMock = {
    verifyAddress: jest.fn(),
  };

  const sellerPayload = {
    sub: 'seller-id',
    email: 'seller@test.com',
    role: Role.SELLER,
  };

  const adminPayload = {
    sub: 'admin-id',
    email: 'admin@test.com',
    role: Role.ADMIN,
  };

  beforeEach(async () => {
    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ProductService,
          {
            provide: DatabaseService,
            useValue: databaseMock,
          },
          {
            provide: SlugServiceProtocol,
            useValue: slugMock,
          },
          {
            provide: ShippingService,
            useValue: shippingMock,
          },
        ],
      }).compile();

    service = module.get(ProductService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create product', async () => {
      databaseMock.user.findUnique.mockResolvedValue({
        id: 'seller-id',
        role: 'SELLER',
      });

      slugMock.generateSlug.mockResolvedValue(
        'product-slug',
      );

      shippingMock.verifyAddress.mockResolvedValue({
        cep: '11665-310',
        localidade: 'São Sebastião',
        uf: 'SP',
      });

      databaseMock.product.create.mockResolvedValue({
        id: 'product-id',
      });

      const result = await service.create(
        {
          name: 'Product',
          description: 'Description',
          amount: 10,
          price: 100,
          mediaTypeId: 1,
          cep: '11665-310',
        },
        'seller-id',
      );

      expect(result.id).toBe('product-id');
    });

    it('should throw NotFoundException', async () => {
      databaseMock.user.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.create(
          {} as any,
          'seller-id',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException', async () => {
      databaseMock.user.findUnique.mockResolvedValue({
        role: 'USER',
      });

      await expect(
        service.create(
          {} as any,
          'seller-id',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('get', () => {
    it('should return products', async () => {
      databaseMock.product.findMany.mockResolvedValue([
        { id: '1' },
      ]);

      const result = await service.get();

      expect(result).toHaveLength(1);
    });
  });

  describe('getMediaTypes', () => {
    it('should return media types', async () => {
      databaseMock.mediaType.findMany.mockResolvedValue([
        { id: 1 },
      ]);

      const result =
        await service.getMediaTypes();

      expect(result).toHaveLength(1);
    });
  });

  describe('getById', () => {
    it('should return product', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        id: 'product-id',
      });

      const result = await service.getById(
        'product-id',
      );

      expect(result.id).toBe('product-id');
    });

    it('should throw NotFoundException', async () => {
      databaseMock.product.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.getById('product-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        id: 'product-id',
        sellerId: 'seller-id',
      });

      databaseMock.product.update.mockResolvedValue({
        id: 'product-id',
      });

      const result = await service.update(
        'product-id',
        {
          name: 'Updated',
        },
        sellerPayload as any,
      );

      expect(result.id).toBe('product-id');
    });

    it('should deny update', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        sellerId: 'seller-id',
      });

      await expect(
        service.update(
          'product-id',
          {},
          {
            sub: 'another-user',
            role: Role.USER,
          } as any,
        ),
      ).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('softDelete', () => {
    it('should soft delete', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        sellerId: 'seller-id',
      });

      databaseMock.product.update.mockResolvedValue({
        isActive: false,
      });

      const result = await service.softDelete(
        'product-id',
        sellerPayload as any,
      );

      expect(result.isActive).toBe(false);
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        sellerId: 'seller-id',
      });

      databaseMock.product.delete.mockResolvedValue({
        id: 'product-id',
      });

      const result = await service.delete(
        'product-id',
        sellerPayload as any,
      );

      expect(result.id).toBe('product-id');
    });

    it('should allow admin delete', async () => {
      databaseMock.product.findUnique.mockResolvedValue({
        sellerId: 'seller-id',
      });

      databaseMock.product.delete.mockResolvedValue({
        id: 'product-id',
      });

      const result = await service.delete(
        'product-id',
        adminPayload as any,
      );

      expect(result.id).toBe('product-id');
    });
  });

  describe('getActiveProductById', () => {
    it('should return active product', async () => {
      jest
        .spyOn(service, 'getById')
        .mockResolvedValue({} as any);

      databaseMock.product.findUnique.mockResolvedValue({
        id: 'product-id',
      });

      const result =
        await service.getActiveProductById(
          'product-id',
        );

      expect(result.id).toBe('product-id');
    });

    it('should throw BadRequestException', async () => {
      jest
        .spyOn(service, 'getById')
        .mockResolvedValue({} as any);

      databaseMock.product.findUnique.mockResolvedValue(
        null,
      );

      await expect(
        service.getActiveProductById(
          'product-id',
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });
});