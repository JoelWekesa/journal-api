import { IsNotEmpty, IsString } from "class-validator";
import { Transform } from "class-transformer";

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => {
        const trimmed = value.trim();
        const lowerCased = trimmed.toLowerCase();
        return lowerCased;
    })
    name: string;

}
