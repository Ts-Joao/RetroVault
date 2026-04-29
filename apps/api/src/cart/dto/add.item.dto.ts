import { IsString, IsInt, Min } from "class-validator";

export class AddItemDto {
    @IsString()
    productID: string;

    @IsInt()
    @Min(1)
    amount: number;
}
