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

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
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
      entities: [User, PhoneVerification, TipLink, TipLinkData, Payment, Organization, Employee, Payout],
      synchronize: true, // delete in production
    }),
    UsersModule,
    AuthModule,
    SmsModule,
    FilesModule,
    TipLinksModule,
    PaymentsModule,
    OrganizationsModule,
    PayoutsModule,
    FinanceModule,
  ]
})
export class AppModule { }
