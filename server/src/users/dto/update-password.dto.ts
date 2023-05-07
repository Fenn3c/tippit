import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator"

export class UpdatePasswordDto {
    @IsString()
    @IsNotEmpty()
    password: string

    @IsStrongPassword()
    newPassword: string

    @IsString()
    @IsNotEmpty()
    newPasswordConfirm: string
}

