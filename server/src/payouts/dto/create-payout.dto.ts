import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CreatePayoutDto {
    @IsNumber()
    @IsNotEmpty()
    @Max(15_000_00)
    @Min(100_00)
    amount: number

    @IsString()
    @IsNotEmpty()
    phoneVerificationId: string

    @IsString()
    @IsNotEmpty()
    phoneVerify: string

    @IsString()
    @IsNotEmpty()
    payoutToken: string
}
