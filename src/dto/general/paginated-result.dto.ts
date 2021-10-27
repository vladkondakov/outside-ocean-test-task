import { IPaginationResultMeta } from "../../interfaces/pagination-result-meta.interface"

export class PaginatedResultDto<T> {
  data: T[]
  meta: IPaginationResultMeta
}
