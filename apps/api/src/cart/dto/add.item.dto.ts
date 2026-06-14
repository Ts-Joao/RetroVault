import { ApiProperty } from "@nestjs/swagger";
import {
    IsInt,
    IsString,
    Min
} from "class-validator";

export class AddItemDto {
    @ApiProperty({
        example: 'uuid-uuid-uuid-uuid',
        description: 'Product ID',
    })
    @IsString()
    readonly productId: string;

    @ApiProperty({
        example: 1,
        description: 'Amount',
    })
    @IsInt()
    @Min(1)
    readonly amount: number;
}
