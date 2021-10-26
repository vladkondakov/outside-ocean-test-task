import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateTagDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  name?: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number
}
