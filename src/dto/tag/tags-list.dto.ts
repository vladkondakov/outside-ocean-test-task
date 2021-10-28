import { ApiProperty } from "@nestjs/swagger"
import { TagDto } from "./tag.dto"

export class TagsListDto {
  @ApiProperty({ description: "List of tags", type: TagDto, isArray: true })
  tags: TagDto[]
}
