import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PaymentsModule } from 'src/payments/payments.module';
import { PayoutsModule } from 'src/payouts/payouts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/users.entity';
import { Payout } from 'src/payouts/entities/payout.entity';

@Module({
  imports: [AuthModule, UsersModule, PaymentsModule, PayoutsModule, TypeOrmModule.forFeature([Payment, User, Payout])],
  controllers: [FinanceController],
  providers: [FinanceService]
})
export class FinanceModule { }
