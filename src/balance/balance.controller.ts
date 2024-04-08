import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { TokenClaim } from "src/_decorators/auth";
import { JwtAuthGuard } from "src/_guard/jwt_auth.guard";
import { TokenClaimDto } from "src/auth/token_claim.dto";
import { BalanceService } from "./balance.service";

@Controller("balance")
@ApiTags("Balance")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class BalanceController {

  constructor(
    private readonly balanceService: BalanceService,
  ){}

  @Get("")
  async getBalance(
    @TokenClaim() tokenClaimDto: TokenClaimDto,
  ) {
    const balance = await this.balanceService.findUserBalance(tokenClaimDto.id)
    return balance
  }
}