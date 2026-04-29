import { IsInt, Min } from "class-validator";

export class UpdatedItemDto {
    @IsInt()
    @Min(1)
    amount: number;
}
