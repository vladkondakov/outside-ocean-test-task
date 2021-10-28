import { ApiProperty } from "@nestjs/swagger"
import { Transform, Type } from "class-transformer"
import { IsEnum, IsNumber, IsOptional } from "class-validator"
import { SortTypeEnum } from "../../enums/tag/sort-order-type.enum"

export class TagListQueryParamsDto {
  @ApiProperty({ example: 1, description: "The value of sort type: 0 (asc), 1 (desc) or 2 (none). If it was not passed then 2 will be chosen", type: SortTypeEnum })
  @IsOptional()
  @Transform((v) => {
    if (v.value) {
      return parseInt(v.value, 10)
    }
    return SortTypeEnum.none
  })
  @IsEnum(SortTypeEnum)
  sortByOrder?: SortTypeEnum

  @ApiProperty({ example: 0, description: "The value of sort type: 0 (asc), 1 (desc) or 2 (none). If it was not passed then 2 will be chosen", type: SortTypeEnum })
  @IsOptional()
  @Transform((v) => {
    if (v.value) {
      return parseInt(v.value, 10)
    }
    return SortTypeEnum.none
  })
  @IsEnum(SortTypeEnum)
  sortByName?: SortTypeEnum

  @ApiProperty({ example: 1, description: "The page to get tags from", type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @ApiProperty({ example: 10, description: "The page size. Default value is 100. Must be less or equal to 100", type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number
}
