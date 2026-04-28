import { IsString, IsInt, Min } from "class-validator";

export class addItemDto {
    @IsString()
    productID: string;

    @IsInt()
    @Min(1)
    amount: number;
}
