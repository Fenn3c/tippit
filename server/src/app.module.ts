import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { PhoneVerification } from './sms/phoneVerifications.entity';
import { FilesModule } from './files/files.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRESS_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, PhoneVerification],
      synchronize: true, // delete in production
    }),
    UsersModule,
    AuthModule,
    SmsModule,
    FilesModule,
  ]
})
export class AppModule {}
