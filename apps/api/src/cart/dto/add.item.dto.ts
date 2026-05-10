import { IsString, IsInt, Min } from "class-validator";

export class AddItemDto {
    @IsString()
    readonly productId: string;

    @IsInt()
    @Min(1)
    readonly amount: number;
}
