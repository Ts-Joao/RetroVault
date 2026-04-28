import { IsInt, Min } from "class-validator";

export class updatedItemDto {
    @IsInt()
    @Min()
    amount: number;
}
