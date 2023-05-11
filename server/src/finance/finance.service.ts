import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payments/entities/payment.entity';
import { Payout } from 'src/payouts/entities/payout.entity';
import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';
import { Between, Repository } from 'typeorm';

@Injectable()
export class FinanceService {
    constructor(
        @InjectRepository(Payment) private readonly paymentRepository: Repository<Payment>,
        @InjectRepository(Payout) private readonly payoutRepository: Repository<Payout>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly usersService: UsersService
    ) { }

    public async getStatistics(userId: number, period: StatisticsPeriod) {
        const user = await this.usersService.getUserById(userId)
        if (!user) throw new NotFoundException('Пользователь не найден')
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
        const total = Math.round(await this.paymentRepository.sum('amount', { receiver: user, paid: true, pay_date: betweenDates })) ?? 0
        const avg = Math.round(await this.paymentRepository.average('amount', { receiver: user, paid: true, pay_date: betweenDates })) ?? 0
        const max = await this.paymentRepository.maximum('amount', { receiver: user, paid: true, pay_date: betweenDates }) ?? 0
        const min = await this.paymentRepository.minimum('amount', { receiver: user, paid: true, pay_date: betweenDates }) ?? 0
        const percent = this.calculatePercentageIncrease(values)
        return {
            period, total, avg, min, max,
            payments: { percent, dates, values }
        }
    }

    public async getOperations(userId: number) {
        const user = await this.usersService.getUserById(userId)
        if (!user) throw new NotFoundException('Пользователь не найден')
        const paymentOperations = await this.paymentRepository.find({
            where: {
                receiver: user,
                paid: true
            },
            order: {
                pay_date: 'DESC'
            }
        })
        const paymentOperationsMapped = paymentOperations.map(operation => {
            return {
                type: 'tip',
                date: operation.pay_date,
                amount: operation.amount,
                comment: operation.comment,
            }
        }
        )
        const payoutOperations = await this.payoutRepository.find({
            where: {
                user: user,
            },
            order: {
                payout_date: 'DESC'
            }
        })
        const payoutOperationsMapped = payoutOperations.map(operation => {
            return {
                type: 'payout',
                date: operation.payout_date,
                amount: operation.amount,
            }
        }
        )
        const sortedOperations = [...paymentOperationsMapped, ...payoutOperationsMapped].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateB.getTime() - dateA.getTime();
        })


        return {
            balance: user.balance,
            operations: sortedOperations
        }
    }

    public async getPayoutData(userId: number) {
        const user = await this.usersService.getUserById(userId)
        if (!user) throw new NotFoundException('Пользователь не найден')
        return {
            balance: user.balance,
            yookassa_agent_id: process.env.YOOKASSA_PAYOUTS_AGENT_ID,
            max_payout_amount: Number(process.env.MAX_PAYOUT_AMOUNT),
            min_payout_amount: Number(process.env.MIN_PAYOUT_AMOUNT)
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

}
