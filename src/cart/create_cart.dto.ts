import { ApiProperty } from "@nestjs/swagger";

export class CreateCartDto {
  @ApiProperty()
  bookId: string

  @ApiProperty()
  quantity: number
} 