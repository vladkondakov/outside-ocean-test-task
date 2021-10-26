import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateTagDto {
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  name: string

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number
}
