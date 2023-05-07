import { Optional } from "@nestjs/common"
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @IsString()
    comment: string

    @IsBoolean()
    @IsNotEmpty()
    payOffCommission: boolean

    @IsNotEmpty()
    @IsString()
    tipLinkUUID: string
}
