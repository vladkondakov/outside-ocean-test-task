import { ApiProperty } from "@nestjs/swagger"
import { IPaginationResultMeta } from "../../interfaces/pagination-result-meta.interface"

export class PaginatedResultDto<T> {
  @ApiProperty({ description: "List of results" })
  data: T[]

  @ApiProperty({ description: "Meta info for pagination" })
  meta: IPaginationResultMeta
}
