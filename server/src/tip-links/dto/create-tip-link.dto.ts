import { IsNotEmpty, IsNumber, IsNumberString, IsString } from "class-validator"

export class CreateTipLinkDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    pageText: string

    @IsString()
    @IsNotEmpty()
    thankText: string

    @IsNumberString()
    minAmount: string

    @IsNumberString()
    maxAmount: string
}
