import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator"

export class CreateTagDto {
  @ApiProperty({ example: "tag name", description: "Tag name. Must be unique and not empty. Max length is 40", type: String })
  @IsString()
  @MaxLength(40)
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: 1, description: "This field is kinda represent of priority. Optional", type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number
}
