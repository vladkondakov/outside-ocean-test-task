import { IPaginationResultMeta } from "./pagination-result-meta.interface"

export interface IPaginatedResult<T> {
  items: T[]
  meta: IPaginationResultMeta
}
