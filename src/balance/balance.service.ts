import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BalanceHistory, BalanceType } from './balance_history.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { UserBalanceDto } from './user_balance.dto';

@Injectable()
export class BalanceService {
  @InjectRepository(BalanceHistory) private balanceHistoryRepository: Repository<BalanceHistory>;

  async addBalance(user: User, point: number, type = BalanceType.ADD) {
    var addBalaneHistory = new BalanceHistory();
    addBalaneHistory.user = user;
    addBalaneHistory.point = point;
    addBalaneHistory.type = type;
    await this.balanceHistoryRepository.save(addBalaneHistory);
  }

  async findUserBalance(userid: string) {
    const query = this.balanceHistoryRepository.createQueryBuilder('balance')
    .select(['sum(balance.point)'])
    .where('balance.userId = :id', { id: userid })

    const balance = await query.execute()
    return <UserBalanceDto>{
      balance: balance[0].sum
    }
  }
}
