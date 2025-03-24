import { IsNotEmpty, IsString } from "class-validator";

export class CreateJournalDto {
    @IsNotEmpty()
    @IsString()
    title: string

    @IsNotEmpty()
    @IsString()
    content: string

    @IsNotEmpty()
    @IsString()
    categoryId: string
}
