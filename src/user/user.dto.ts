import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty()
  firstName: string

  @ApiProperty()
  lastName: string

  @ApiProperty({format: 'email'})
  email: string

  @ApiProperty({format: 'password'})
  password: string
}