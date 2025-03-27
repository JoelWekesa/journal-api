import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { passwordRegex } from "../../utils/pass-regex";

export class UpsertUserDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsString()
    @Matches(passwordRegex, { message: 'Password too weak' })
    password?: string;

    @IsOptional()
    @IsString()
    name?: string;
}