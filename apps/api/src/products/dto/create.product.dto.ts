import {
    IsString,
    IsNotEmpty,
    IsNumber
} from 'class-validator';

export class CreateProductDto {
    @IsString({ message: 'the name to be a have string'})
    @IsNotEmpty({ message: 'name is required'})
    readonly name: string;

    @IsNumber()
    @IsNotEmpty({ message: 'price is required'})  
    readonly price: number; 

    @IsString({ message: 'the description to be a have string'})
    @IsNotEmpty({ message: 'description is required'})
    readonly description: string;
}