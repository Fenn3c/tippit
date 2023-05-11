import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Req, UseGuards } from '@nestjs/common';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { UsersService } from 'src/users/users.service';
import { SmsService } from 'src/sms/sms.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payout } from './entities/payout.entity';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import axios from 'axios';
const YOOKASSA_API = 'https://api.yookassa.ru/v3'

@Injectable()
export class PayoutsService {

  constructor(
    @InjectRepository(Payout)
    private readonly payoutRepository: Repository<Payout>,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService
  ) { }

  private async createYookassaPayout(payoutUUID: string, amount: number, payoutToken: string): Promise<{
    id: string
  }> {
    const amountRUB = (amount / 100).toFixed(2)
    if (isNaN(Number(amountRUB))) throw new InternalServerErrorException('Ошибка обработки суммы')
    try {
      const res = await axios.post(`${YOOKASSA_API}/payouts`, {
        amount: {
          value: amountRUB,
          currency: 'RUB'
        },
        payout_token: payoutToken,
        description: `Выплата чаевых`,
        metadata: {
          payoutUUID: payoutUUID
        }
      }, {
        auth: {
          username: process.env.YOOKASSA_PAYOUTS_AGENT_ID,
          password: process.env.YOOKASSA_PAYOUTS_SECRET
        },
        headers: {
          "Idempotence-Key": payoutUUID
        }
      })
      return res.data
    } catch (e) {
      console.error(e)
      throw new InternalServerErrorException('Ошибка выплаты юкасса')
    }
  }


  async create(createPayoutDto: CreatePayoutDto, userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new NotFoundException('Пользователь не найден')
    if (createPayoutDto.amount > user.balance) throw new BadRequestException('Запрашиваемая сумма вывода больше баланса пользователя')
    await this.smsService.verifyPhone(createPayoutDto.phoneVerificationId, createPayoutDto.phoneVerify)
    const payout = new Payout()
    payout.uuid = v4()
    payout.amount = createPayoutDto.amount
    payout.payout_token = createPayoutDto.payoutToken
    user.balance -= createPayoutDto.amount
    const data = await this.createYookassaPayout(payout.uuid, payout.amount, payout.payout_token)
    payout.payout_date = new Date()
    payout.payout_id = data.id
    return await this.payoutRepository.manager.transaction(async (manager) => {
      payout.user = await manager.save(user)
      return await manager.save(payout)
    })
  }

  findAll() {
    return `This action returns all payouts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payout`;
  }

  update(id: number, updatePayoutDto: UpdatePayoutDto) {
    return `This action updates a #${id} payout`;
  }

  remove(id: number) {
    return `This action removes a #${id} payout`;
  }
}
