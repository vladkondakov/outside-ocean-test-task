import { IPaginationMeta } from "src/interfaces/pagination-meta.interface"

export class GeneralHelpers {
  static getPaginationMeta(pageNumber: number, pageSize: number, totalResults: number): IPaginationMeta {
    let totalPages = Math.floor(totalResults / pageSize)
    if (totalResults === 0 || totalResults % pageSize > 0) {
      totalPages += 1
    }

    const actualPage = totalPages >= pageNumber ? pageNumber : totalPages
    const offset = (actualPage - 1) * pageSize

    const result: IPaginationMeta = {
      totalPages,
      actualPage,
      offset,
    }

    return result
  }
}
