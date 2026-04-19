import {
    IsString,
    IsDecimal,
    IsOptional,
    IsNotEmpty
} from "class-validator";

export class CreateProductDto {
    @IsString({ message: 'the name to be a have string'})
    @IsNotEmpty({ message: 'name is required'})
    readonly name: string;

    @IsDecimal()
    @IsNotEmpty({ message: 'price is required'})
    readonly price: decimal;

    @IsString({ message: 'the descriptio to be a have string'})
    @IsOptional()
    readonly description?: string
}