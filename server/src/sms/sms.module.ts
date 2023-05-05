import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerification } from './phoneVerifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneVerification])],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService]
})
export class SmsModule { }
