import { Injectable } from "@nestjs/common"
import { CreateTagDto } from "src/dto/tag/create-tag.dto"
import { TagDto } from "src/dto/tag/tag.dto"

import { DatabaseService } from "src/services/database.service"

@Injectable()
export class TagRepository {
  constructor(private readonly _databaseService: DatabaseService) {}

  async createTag(uid: string, tagToCreate: CreateTagDto): Promise<void> {
    const { name, sortOrder } = tagToCreate
    const queryText = `INSERT INTO public.tags(name, creator) VALUES ('${name}', '${uid}')`
    await this._databaseService.getQueryResult<any>(queryText)

    if (sortOrder) {
      const updateQueryText = `UPDATE public.tags AS tags SET tags.sortorder = ${sortOrder}`
      await this._databaseService.getQueryResult<any>(updateQueryText)
    }
  }

  async getTagByName(name: string): Promise<TagDto> {
    const queryText = `SELECT id, name, sortorder AS sortOrder FROM public.tags AS tags
      WHERE tags.name = '${name}'`
    const { row: tag } = await this._databaseService.getQueryResult<TagDto>(queryText)

    return tag
  }

  async getTagsByCreator(creator: string): Promise<TagDto[]> {
    const queryText = `SELECT id, name, sortorder AS sortOrder FROM public.tags AS tags
      WHERE tags.creator = '${creator}'`
    const { rows: tags } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)

    return tags
  }
}
