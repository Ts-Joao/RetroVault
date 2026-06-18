import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class UpdatedItemDto {
    @ApiProperty({
        example: 1,
        description: 'Amount',
    })
    @IsInt()
    @Min(1)
    readonly amount: number;
}
