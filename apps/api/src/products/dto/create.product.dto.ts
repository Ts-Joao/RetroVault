import { IsOptional, IsArray, IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly price: number;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsNumber()
  @IsNotEmpty()
  readonly amount: number;

  @IsNumber()
  @IsNotEmpty()
  readonly mediaTypeId: number;

  @IsNumber()
  @IsOptional()
  readonly maxInstallments?: number;

  @IsNumber()
  @IsOptional()
  readonly freeInstallments?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly genres?: string[]; // array de nomes de gênero
}