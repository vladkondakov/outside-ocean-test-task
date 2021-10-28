import { ApiProperty } from "@nestjs/swagger"

export class TagDto {
  @ApiProperty({ example: 1, description: "Tag id", type: Number })
  id: number

  @ApiProperty({ example: "uuid", description: "Uuid of the user who created the tag", type: String })
  creator?: string

  @ApiProperty({ example: "tag name", description: "Unique tag name", type: String })
  name: string

  @ApiProperty({ example: 0, description: "This field is kinda represent of priority", type: Number })
  sortOrder: number
}
