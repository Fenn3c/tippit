import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"

export class UpdateTipLinkDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    pageText: string

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    thankText: string

    @IsNumberString()
    @IsOptional()
    minAmount: string

    @IsNumberString()
    @IsOptional()
    maxAmount: string
}
