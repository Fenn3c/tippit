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
import { ConfigService } from '@nestjs/config';

const YOOKASSA_API = 'https://api.yookassa.ru/v3/'

@Injectable()
export class PaymentsService {
  constructor(@InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly tipLinksService: TipLinksService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService) { }

  public calculateCommission(amount: number): number {
    const percent = Number(this.configService.get('COMMISION_PERCENT'))
    return Math.ceil(amount / 100 * percent)
  }




  private async createYookassaPayment(amount: number, paymentUUID: string): Promise<{
    id: string,
    confirmation: {
      confirmation_url: string
    }
  }> {
    const amountRUB = (amount / 100).toFixed(2)
    if (isNaN(Number(amountRUB))) throw new InternalServerErrorException('Ошибка обработки суммы')
    try {
      const res = await axios.post(`${YOOKASSA_API}/payments`, {
        amount: {
          value: amountRUB,
          currency: "RUB"
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: `${this.configService.get('DOMAIN_NAME')}/confirm-payment/${paymentUUID}`
        },
        description: "Оплата чаевых"
      }, {
        auth: {
          username: this.configService.get('YOOKASSA_SHOP_ID'),
          password: this.configService.get('YOOKASSA_SECRET')
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
    if (payment.amount > tipLink.tipLinkData.max_amount) throw new BadRequestException('Сумма больше максимально допустимой')
    if (payment.amount < tipLink.tipLinkData.min_amount) throw new BadRequestException('Сумма меньше минимально допустимой')
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
          username: this.configService.get('YOOKASSA_SHOP_ID'),
          password: this.configService.get('YOOKASSA_SECRET')
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
