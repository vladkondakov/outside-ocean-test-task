import { BadRequestException, Injectable } from "@nestjs/common"
import { TagDto } from "src/dto/tag/tag.dto"
import { UpdateUserDto } from "src/dto/user/update-user.dto"
import { UserToInsert } from "src/dto/user/user-to-insert.dto"
import { UserDto } from "src/dto/user/user.dto"
import { DatabaseService } from "src/services/database.service"

@Injectable()
export class UserTagRepository {
  constructor(private readonly _databaseService: DatabaseService) {}

  async addTagsToUser(uid: string, tags: number[]) {
    const queryText = this.formQueryText(uid, tags)
    const { rows } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)
    return rows
  }

  async deleteTagFromUser(uid: string, tagId: number) {
    const queryText = `DELETE FROM public.user_tag
      WHERE tag_id = ${tagId} AND user_uid = '${uid}'`
    await this._databaseService.getQueryResult<any>(queryText)
  }

  async getTagsOfCurrentUser(uid: string): Promise<TagDto[]> {
    const queryText = `SELECT t.id, t.name, t.sortorder AS sortOrder
      FROM public.tags AS t
      LEFT JOIN public.user_tag AS ut
      ON ut.tag_id = t.id
      WHERE (ut.user_uid = '${uid}')`

    const { rows } = await this._databaseService.getQueryArrayResult<TagDto>(queryText)
    return rows
  }

  private formQueryText(uid: string, tags: number[]): string {
    let insertPart = `WITH inserted AS (
      INSERT INTO user_tag (user_uid, tag_id)
      VALUES `

    tags.forEach((tagId) => {
      insertPart += `('${uid}', ${tagId}), `
    })

    insertPart = insertPart.slice(0, -2)

    insertPart += `
    ON CONFLICT (user_uid, tag_id) DO NOTHING
    RETURNING tag_id)
    `

    const selectPart = `SELECT t.id, t.name, t.sortorder AS "sortOrder"
      FROM tags AS t
      WHERE t.id IN (
        SELECT * FROM inserted
      )`

    return insertPart + selectPart
  }
}
