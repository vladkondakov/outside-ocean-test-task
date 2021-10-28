import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator"

export class UpdateTagDto {
  @ApiProperty({ example: "tag name", description: "Tag name. Optional. Max length is 40 and must be unique", type: String })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  name?: string

  @ApiProperty({ example: 1, description: "This field is kinda represent of priority. Optional", type: Number })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sortOrder?: number
}
