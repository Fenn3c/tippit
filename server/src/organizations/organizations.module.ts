import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { UsersModule } from 'src/users/users.module';
import { FilesModule } from 'src/files/files.module';
import { Employee } from './entities/employee.entity';
import { TipLinksModule } from 'src/tip-links/tip-links.module';
import { TipLink } from 'src/tip-links/entities/tip-link.entity';

@Module({
  imports: [AuthModule, UsersModule, FilesModule, TipLinksModule, TypeOrmModule.forFeature([Organization, Employee, TipLink])],
  controllers: [OrganizationsController],
  providers: [OrganizationsService]
})
export class OrganizationsModule { }
