import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export class UpdateUserDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    surname: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    position: string
}

