import { ApiProperty } from "@nestjs/swagger"

export class TagFullDto {
  @ApiProperty({ description: "Full info of the user who created the tag" })
  creator?: {
    nickname: string
    uid: string
  }

  @ApiProperty({ description: "Tag name", type: String })
  name: string

  @ApiProperty({ description: "This field is kinda represent of priority", type: Number })
  sortOrder: number
}
