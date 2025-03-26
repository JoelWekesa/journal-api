import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";

export class YearFreqDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => {
        return parseInt(value)
    }
    )
    year: number
}