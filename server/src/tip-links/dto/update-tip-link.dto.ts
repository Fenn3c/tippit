import { IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString } from "class-validator"
import { CreateTipLinkDto } from "./create-tip-link.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateTipLinkDto extends PartialType(CreateTipLinkDto) {}
