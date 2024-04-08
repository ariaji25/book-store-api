import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { jwtConstants } from "src/auth/constants";
import { TokenClaimDto } from "src/auth/token_claim.dto";

export const TokenClaim = createParamDecorator((data: unknown, ctx: ExecutionContext) =>  {

  const request = ctx.switchToHttp().getRequest<Request>();
  const token = request.headers['authorization'] ?? undefined;
  
  if (!token || !isBearerToken(token)) {
    throw new UnauthorizedException({message: "Invalid token"})
  }
  return claimToken(token.replace("Bearer ",""))
  
})

const isBearerToken = (token: string) => {
  return [token.startsWith('Bearer ')];
}

const claimToken = (token: string) => {
  const jwtService = new JwtService(jwtConstants)
  const decoded = jwtService.verify<TokenClaimDto>(token);
  if (!decoded) {
    throw new Error('Invalid token');
  }
  return decoded;
}