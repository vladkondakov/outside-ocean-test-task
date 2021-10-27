import { Injectable } from "@nestjs/common"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagFullDbDto } from "src/dto/tag/tag-full-db.dto"
import { TagListQueryParamsDto } from "src/dto/tag/tag-list-query-params.dto"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateTagDto } from "src/dto/tag/update-tag.dto"
import { SortTypeEnum } from "src/enums/tag/sort-order-type.enum"
import { GeneralHelpers } from "src/helpers/helpers"
import { IPaginatedResult } from "src/interfaces/paginated-result.interface"
import { IPaginationMeta } from "src/interfaces/pagination-meta.interface"
import { IPaginationResultMeta } from "src/interfaces/pagination-result-meta.interface"

import { DatabaseService } from "src/services/database.service"

@Injectable()
export class TagRepository {
  constructor(private readonly _databaseService: DatabaseService) {}

  async createTag(uid: string, tagToCreate: CreateTagDto): Promise<void> {
    const { name, sortOrder } = tagToCreate
    const queryText = `INSERT INTO public.tags(name, creator) VALUES ('${name}', '${uid}')`
    await this._databaseService.getQueryResult<any>(queryText)

    if (sortOrder) {
      const updateQueryText = `UPDATE public.tags SET sortorder = ${sortOrder} WHERE name = '${name}'`
      await this._databaseService.getQueryResult<any>(updateQueryText)
    }
  }

  async getTagByName(name: string): Promise<TagDto> {
    const queryText = `SELECT id, name, sortorder AS "sortOrder" FROM public.tags AS tags
      WHERE tags.name = '${name}'`
    const { row: tag } = await this._databaseService.getQueryResult<TagDto>(queryText)

    return tag
  }

  async getTagsByCreator(creator: string): Promise<TagDto[]> {
    const queryText = `SELECT id, name, sortorder AS "sortOrder" FROM public.tags AS tags
      WHERE tags.creator = '${creator}'`
    const { rows: tags } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)

    return tags
  }

  async getTagById(tagId: number): Promise<TagDto> {
    const queryText = `SELECT id, creator, name, sortorder AS "sortOrder" FROM public.tags AS tags
      WHERE tags.id = ${tagId}`
    const { row: tag } = await this._databaseService.getQueryResult<TagDto>(queryText)

    return tag
  }

  async updateTag(tagId: number, tagToUpdate: UpdateTagDto): Promise<void> {
    const { name, sortOrder } = tagToUpdate
    const queryText = `UPDATE tags SET
        name = '${name}',
        sortorder = ${sortOrder}
      WHERE id = '${tagId}'`

    await this._databaseService.getQueryResult<any>(queryText)
  }

  async deleteTagCascade(tagId: number): Promise<void> {
    const queryText = `DELETE FROM public.tags AS tags
      WHERE tags.id = '${tagId}'`
    await this._databaseService.getQueryResult<any>(queryText)
  }

  async getSortedPaginatedTags(queryParams: TagListQueryParamsDto): Promise<IPaginatedResult<TagFullDbDto>> {
    const { sortByName, sortByOrder, page, pageSize } = queryParams
    let queryText = `SELECT DISTINCT t.name, t.sortorder AS "sortOrder", u.nickname, u.uid
        FROM public.tags t
        LEFT JOIN public.users AS u
        ON t.creator = u.uid
      `
    if (sortByOrder === SortTypeEnum.asc) {
      queryText += `ORDER BY sortOrder ASC`
    }
    if (sortByOrder === SortTypeEnum.desc) {
      queryText += `ORDER BY sortOrder DESC`
    }
    if (sortByName === SortTypeEnum.asc) {
      queryText += `ORDER BY name ASC`
    }
    if (sortByName === SortTypeEnum.asc) {
      queryText += `ORDER BY name DESC`
    }

    const { rowsCount } = await this._databaseService.getQueryArrayResult<TagFullDbDto>(queryText)
    const { offset, actualPage, totalPages } = GeneralHelpers.getPaginationMeta(page, pageSize, rowsCount)

    const queryTextWithOffset =
      queryText +
      `
      LIMIT ${pageSize}
      OFFSET ${offset}`

    const { rows: tags } = await this._databaseService.getQueryArrayResult<TagFullDbDto>(queryText)
    const meta: IPaginationResultMeta = {
      page: actualPage,
      pageSize,
      totalPages,
      quantity: rowsCount,
    }

    const result: IPaginatedResult<TagFullDbDto> = {
      items: tags,
      meta,
    }

    return result
  }

  async getTags() {
    const queryText = `SELECT id FROM public.tags AS tags`
    const { rows: tags } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)
    return tags
  }

  async addTagsToUser() {
    const queryText = ``

    const { rows: tags } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)
    return tags
  }
}
