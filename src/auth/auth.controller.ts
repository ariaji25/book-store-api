import { BadRequestException, Body, Controller, Get, Post, UnauthorizedException, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserService } from "src/user/user.service";
import { UserDto } from "src/user/user.dto";
import { LoginDto } from "./login.dto";
import { TokenClaim } from "src/_decorators/auth";
import { TokenClaimDto } from "./token_claim.dto";
import { JwtAuthGuard } from "src/_guard/jwt_auth.guard";

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ){}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ) {
    try {
      const user = await this.authService.login(loginDto)
      return user
    } catch (error) {
      throw new UnauthorizedException({message: "Invalid email or password"})
    }
  }

  @Post('register')
  async register(
    @Body() user: UserDto
  ) {
    try {
      await this.userService.register(user)
      return { message: 'User created successfully'}
    } catch (error) {
      throw new BadRequestException({message: "Email exist"})
    }
  }

  @Get("me")
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)  
  async me(@TokenClaim() tokenCalimDto: TokenClaimDto) {
    return tokenCalimDto
  }
}