import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { TipLinksModule } from 'src/tip-links/tip-links.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/users.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, User]), TipLinksModule, UsersModule, AuthModule],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule { }
