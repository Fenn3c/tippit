import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Between, Repository } from 'typeorm';
import { v4 } from 'uuid';
import { TipLinksService } from 'src/tip-links/tip-links.service';
import { UsersService } from 'src/users/users.service';
import axios from 'axios';
import { User } from 'src/users/users.entity';

const YOOKASSA_API = 'https://api.yookassa.ru/v3/'

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tipLinksService: TipLinksService,
    private readonly usersService: UsersService) { }

  public calculateCommission(amount: number): number {
    const percent = Number(process.env.COMMISION_PERCENT)
    return Math.ceil(amount / 100 * percent)
  }

  public async getOperations(userId: number) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new BadRequestException('Пользователь не найден')
    const operations = await this.paymentRepository.find({
      where: {
        receiver: user,
        paid: true
      },
      order: {
        pay_date: 'DESC'
      }
    })
    const operationsMapped = operations.map(operation => {
      return {
        type: 'tip',
        date: operation.pay_date,
        amount: operation.amount,
        comment: operation.comment,
      }
    }
    )
    return {
      balance: user.balance,
      operations: operationsMapped
    }
  }
  private getPeriodDates(period: StatisticsPeriod) {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();
    const startOfWeek = new Date(year, month, day - today.getDay());
    const startOfMonth = new Date(year, month, 1);
    const startOfYear = new Date(year, 0, 1);
    switch (period) {
      case StatisticsPeriod.Year:
        return {
          startDate: startOfYear,
          endDate: new Date(year, 11, 31),
        }
      case StatisticsPeriod.Month:
        return {
          startDate: startOfMonth,
          endDate: new Date(year, month + 1, 0),
        }
      case StatisticsPeriod.Week:
        return {
          startDate: startOfWeek,
          endDate: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000),
        }
      case StatisticsPeriod.Total:
        return undefined
      default:
        throw new BadRequestException('Указан неверный период')
    }
  }

  private calculatePercentageIncrease(arr: number[]): number {
    if (arr.length < 2) {
      return 0;
    }

    const lastElement = arr[arr.length - 1];
    const previousElement = arr[arr.length - 2];

    return Number((((lastElement - previousElement) / previousElement) * 100).toFixed(2));
  }


  public async getStatistics(userId: number, period: StatisticsPeriod) {
    const user = await this.usersService.getUserById(userId)
    if (!user) throw new BadRequestException('Пользователь не найден')
    const periodDates = this.getPeriodDates(period)
    const betweenDates = periodDates ? Between(periodDates.startDate, periodDates.endDate) : undefined
    const operations = await this.paymentRepository.find({
      where: {
        receiver: user,
        paid: true,
        pay_date: betweenDates
      },
      order: {
        pay_date: 'ASC'
      }
    })
    const operationsMapped = operations.map(operation => {
      return { date: operation.pay_date, value: operation.amount }
    })
    const dates = operationsMapped.map(operation => operation.date)
    const values = operationsMapped.map(operation => operation.value)
    const total = Math.round(await this.paymentRepository.sum('amount', { receiver: user, paid: true, pay_date: betweenDates }))
    const avg = Math.round(await this.paymentRepository.average('amount', { receiver: user, paid: true, pay_date: betweenDates }))
    const max = await this.paymentRepository.maximum('amount', { receiver: user, paid: true, pay_date: betweenDates })
    const min = await this.paymentRepository.minimum('amount', { receiver: user, paid: true, pay_date: betweenDates })
    const percent = this.calculatePercentageIncrease(values)
    return {
      period, total, avg, min, max,
      payments: { percent, dates, values }
    }
  }

  private async createYookassaPayment(amount: number, paymentUUID: string): Promise<{
    id: string,
    confirmation: {
      confirmation_url: string
    }
  }> {
    const amountRUB = Number((amount / 100).toFixed(2))
    if (isNaN(amountRUB)) throw new InternalServerErrorException('Ошибка обработки суммы')
    try {
      const res = await axios.post(`${YOOKASSA_API}/payments`, {
        amount: {
          value: amountRUB,
          currency: "RUB"
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${process.env.DOMAIN_NAME}/confirm-payment/${paymentUUID}`
        },
        description: "Оплата чаевых"
      }, {
        auth: {
          username: process.env.YOOKASSA_SHOP_ID,
          password: process.env.YOOKASSA_SECRET
        },
        headers: {
          "Idempotence-Key": paymentUUID
        }
      })
      return res.data
    } catch (e) {
      throw new InternalServerErrorException('Ошибка создания страницы платежа')
    }
  }

  async create(createPaymentDto: CreatePaymentDto) {
    const tipLink = await this.tipLinksService.findOneByUUID(createPaymentDto.tipLinkUUID)
    const user = await this.usersService.getUserById(tipLink.user.id)
    if (!tipLink) throw new BadRequestException('Ссылка чаевых не найдена')
    if (!user) throw new BadRequestException('Пользователь не найден')
    const payment = new Payment()
    payment.receiver = user
    payment.tip_link = tipLink
    payment.uuid = v4()
    payment.comment = createPaymentDto.comment
    payment.commision_amount = this.calculateCommission(createPaymentDto.amount)
    payment.pay_off_commission = createPaymentDto.payOffCommission
    let amountToPay = null
    if (createPaymentDto.payOffCommission) {
      payment.amount = createPaymentDto.amount
      amountToPay = createPaymentDto.amount + payment.commision_amount
    } else {
      payment.amount = createPaymentDto.amount - payment.commision_amount
      amountToPay = createPaymentDto.amount
    }
    if (!amountToPay) throw new InternalServerErrorException('Ошибка обработки платежа')
    if (payment.amount > tipLink.max_amount) throw new BadRequestException('Сумма больше максимально допустимой')
    if (payment.amount < tipLink.min_amount) throw new BadRequestException('Сумма меньше минимально допустимой')
    const yooKassaPayment = await this.createYookassaPayment(amountToPay, payment.uuid)
    payment.payment_id = yooKassaPayment.id
    payment.payment_link = yooKassaPayment.confirmation.confirmation_url
    payment.created_date = new Date()
    payment.paid = false
    return this.paymentRepository.save(payment)
  }


  async checkYookassaPayment(paymentId: string) {
    try {
      const res = await axios.get(`${YOOKASSA_API}/payments/${paymentId}`, {
        auth: {
          username: process.env.YOOKASSA_SHOP_ID,
          password: process.env.YOOKASSA_SECRET
        }
      })
      return res.data
    } catch (e) {
      console.error(e)
      throw new InternalServerErrorException('Ошибка проверки платежа')
    }
  }


  async confirmPayment(uuid: string) {
    const payment = await this.findOneByUUID(uuid)
    if (!payment) throw new BadRequestException('Платеж не найден')
    if (payment.paid) throw new BadRequestException('Платеж уже подтвержден')
    const user = await this.userRepository.findOneBy(payment.receiver)
    if (!user) throw new BadRequestException('Пользователь не найден')
    const checkPayement = await this.checkYookassaPayment(payment.payment_id)
    if (checkPayement.status !== 'succeeded') throw new InternalServerErrorException('Платеж не успешен')
    payment.pay_date = new Date()
    payment.paid = true
    let savedPayment = null
    await this.paymentRepository.manager.transaction(async (manager) => {
      savedPayment = await manager.save(payment)
      user.balance = user.balance + payment.amount
      await manager.save(user)
    })
    return savedPayment
  }


  async findOneByUUID(uuid: string) {
    return await this.paymentRepository.findOne({
      relations: ['tip_link', 'receiver'],
      where: { uuid: uuid }
    })
  }








  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  // update(id: number, updatePaymentDto: UpdatePaymentDto) {
  //   return `This action updates a #${id} payment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
