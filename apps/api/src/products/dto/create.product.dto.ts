import {
  IsOptional,
  IsArray,
  IsString,
  IsNumber,
  IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Produto 1',
    description: 'Nome do produto',
  })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({
    example: 100.00,
    description: 'Preço do produto',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @ApiProperty({
    example: 'Descrição do produto',
    description: 'Descrição do produto',
  })
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({
    example: 10,
    description: 'Quantidade do produto',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @ApiProperty({
    example: 1,
    description: 'Tipo de mídia do produto',
  })
  @IsNumber()
  @IsNotEmpty()
  readonly mediaTypeId: number;

  @ApiProperty({
    example: 12,
    description: 'Quantidade máxima de parcelas do produto',
  })
  @IsNumber()
  @IsOptional()
  readonly maxInstallments?: number;

  @ApiProperty({
    example: 0,
    description: 'Quantidade de parcelas grátis do produto',
  })
  @IsNumber()
  @IsOptional()
  readonly freeInstallments?: number;

  @ApiProperty({
    example: ['Ação', 'Aventura'],
    description: 'Gêneros do produto',
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly genres?: string[]; // array de nomes de gênero
}