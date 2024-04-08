import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './login.dto';
import { JwtService } from '@nestjs/jwt';
import { TokenClaimDto } from './token_claim.dto';

@Injectable()
export class AuthService {
  @InjectRepository(User) private userRepository: Repository<User>;

  constructor(private readonly jwtService: JwtService) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }
    return this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = <TokenClaimDto>{
      email: user.email,
      firstName: user.firstName,
      id: user.id,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async claimToken(token: string) {
    const decoded = this.jwtService.verify(token);
    const user = await this.userRepository.findOneBy({ email: decoded.email });
    if (!user) {
      throw new Error('Invalid token');
    }
    return user;
  }
}
