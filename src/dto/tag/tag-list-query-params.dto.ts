import { Transform, Type } from "class-transformer"
import { isBoolean, IsBoolean, IsBooleanString, IsEnum, IsNumber, IsOptional } from "class-validator"
import { SortTypeEnum } from "src/enums/tag/sort-order-type.enum"

export class TagListQueryParamsDto {
  @IsOptional()
  @Transform((v) => {
    if (v.value) {
      return parseInt(v.value, 10)
    }
    return SortTypeEnum.none
  })
  @IsEnum(SortTypeEnum)
  sortByOrder?: SortTypeEnum

  @IsOptional()
  @Transform((v) => {
    if (v.value) {
      return parseInt(v.value, 10)
    }
    return SortTypeEnum.none
  })
  @IsEnum(SortTypeEnum)
  sortByName?: SortTypeEnum

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  pageSize?: number
}
