import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { BalanceService } from 'src/balance/balance.service';

@Injectable()
export class UserService {
  @InjectRepository(User) private userRepository: Repository<User>;
  constructor(
    private readonly balanceService: BalanceService
  ){}

  async register(user: UserDto) {
    if (await this.isEmailExist(user.email)) {
      throw new Error('Email already exist');
    }
    const newUser = this.userRepository.create(user);
    await this.userRepository.save(newUser);
    await this.balanceService.addBalance(newUser, 100);
    return newUser;
  }

  private async isEmailExist(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user) {
      return true;
    }
    return false;
  }
}
