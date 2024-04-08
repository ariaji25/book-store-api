import { ApiProperty } from "@nestjs/swagger";
import { CreateCartDto } from "./create_cart.dto";

export class UpdateCartDto extends CreateCartDto {
  @ApiProperty()
  id: string
}