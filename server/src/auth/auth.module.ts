import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { SmsModule } from 'src/sms/sms.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    SmsModule,
    JwtModule.register({
      secret: process.env.JWT_PRIVATE_KEY || 'SECRET',
      signOptions: {
        expiresIn: '24h'
      }
    })],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule]
})
export class AuthModule { }