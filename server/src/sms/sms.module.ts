import { Module, forwardRef } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerification } from './phoneVerifications.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule), TypeOrmModule.forFeature([PhoneVerification])],
  providers: [SmsService],
  controllers: [SmsController],
  exports: [SmsService]
})
export class SmsModule { }
