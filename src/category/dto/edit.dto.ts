import { PartialType } from "@nestjs/mapped-types";
import { CreateCategoryDto } from "./create.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class EditCategoryDto extends PartialType(CreateCategoryDto) {
    @IsNotEmpty()
    @IsString()
    id: string
}