import { IsInt, IsString, Min } from "class-validator";

export class UpdatedItemDto {
    @IsInt()
    @Min(1)
    readonly amount: number;
}
