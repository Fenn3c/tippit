import { Module } from '@nestjs/common';
import { TipLinksService } from './tip-links.service';
import { TipLinksController } from './tip-links.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipLink } from './entities/tip-link.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    FilesModule,
    UsersModule,
    TypeOrmModule.forFeature([TipLink]),
    AuthModule
  ],
  controllers: [TipLinksController],
  providers: [TipLinksService],
  exports: [TipLinksService]
})
export class TipLinksModule { }
