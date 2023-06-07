import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './users/users.entity';
import { AuthModule } from './auth/auth.module';
import { SmsModule } from './sms/sms.module';
import { PhoneVerification } from './sms/phoneVerifications.entity';
import { FilesModule } from './files/files.module';
import { TipLinksModule } from './tip-links/tip-links.module';
import { TipLink } from './tip-links/entities/tip-link.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PaymentsModule } from './payments/payments.module';
import * as path from 'path';
import { Payment } from './payments/entities/payment.entity';
import { OrganizationsModule } from './organizations/organizations.module';
import { Organization } from './organizations/entities/organization.entity';
import { Employee } from './organizations/entities/employee.entity';
import { TipLinkData } from './tip-links/entities/tip-link-data.entity';
import { PayoutsModule } from './payouts/payouts.module';
import { Payout } from './payouts/entities/payout.entity';
import { FinanceModule } from './finance/finance.module';
import { envValidationSchema } from './envValidationSchema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [AppController], // Главный контроллер
  providers: [AppService], // Главный провайдер
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }), // Подключение раздачи статики
    TypeOrmModule.forRootAsync({ // Подключение TypeOrm
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => (
        {
          type: 'postgres',
          host: configService.get<string>('POSTGRES_HOST'),
          port: configService.get<number>('POSTGRES_PORT'),
          username: configService.get<string>('POSTGRES_USER'),
          password: configService.get<string>('POSTGRES_PASSWORD'),
          database: configService.get<string>('POSTGRES_DB'),
          entities: [User, PhoneVerification, TipLink, TipLinkData, Payment, Organization, Employee, Payout],
          synchronize: true, // delete in production
        }),
      inject: [ConfigService]
    }),
    ConfigModule.forRoot( // Подключение конфига
      { envFilePath: `.${process.env.NODE_ENV}.env`, isGlobal: true, validationSchema: envValidationSchema }
    ),
    ScheduleModule.forRoot(), // Модуль таймера
    UsersModule, // Модуль пользователей
    AuthModule, // Модуль аутентификации
    SmsModule, // Модуль SMS
    FilesModule, // Модуль файлов
    TipLinksModule, // Модуль ссылок
    PaymentsModule, // Модуль платежей
    OrganizationsModule, // Модуль организаций
    PayoutsModule, // Модуль выплат
    FinanceModule, // Модуль финансов
  ]
})
export class AppModule { }
