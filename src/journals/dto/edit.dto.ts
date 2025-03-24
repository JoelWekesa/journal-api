import { PartialType } from "@nestjs/mapped-types";
import { CreateJournalDto } from "./create.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class EditJournalDto extends PartialType(CreateJournalDto) {
    @IsNotEmpty()
    @IsString()
    id: string
}