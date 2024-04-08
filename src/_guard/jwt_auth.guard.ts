import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers['authorization'] ?? undefined;
    if (!token || !this.isBearerToken(token)) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }

    try {
      var claimed = await this.authService.claimToken(
        token.replace('Bearer ', ''),
      );
      if (!claimed) {
        throw new UnauthorizedException({ message: 'Invalid token' });
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException({ message: 'Invalid token' });
    }
  }

  private isBearerToken(token: string): boolean {
    return token.startsWith('Bearer ');
  }
}
