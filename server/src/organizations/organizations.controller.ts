import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }


  @Get(':uuid/invite')
  @UseGuards(JwtAuthGuard)
  async invite(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.invite(uuid, req.user.id);
  }


  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() banner, @Req() req) {
    return await this.organizationsService.create(createOrganizationDto, req.user.id, banner);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return await this.organizationsService.findAll(req.user.id);
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.findOneByUUID(uuid);
  }

  @Get('/employees/:uuid')
  @UseGuards(JwtAuthGuard)
  async findEmployee(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.findEmployee(uuid, req.user.id)
  }

  @Patch('/employees/:uuid/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmEmployee(@Param('uuid') uuid: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @Req() req) {
    return await this.organizationsService.confirmEmployee(updateEmployeeDto, uuid, req.user.id)
  }

  @Patch('/employees/:uuid')
  @UseGuards(JwtAuthGuard)
  async updateEmployee(@Param('uuid') uuid: string, @Body() updateEmployeeDto: UpdateEmployeeDto, @Req() req) {
    return await this.organizationsService.updateEmployee(updateEmployeeDto, uuid, req.user.id)
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async update(@Param('uuid') uuid: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @UploadedFile() banner, @Req() req) {
    return await this.organizationsService.update(uuid, updateOrganizationDto, req.user.id, banner);
  }

  @Delete('/employees/:uuid')
  @UseGuards(JwtAuthGuard)
  async removeEmployee(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.removeEmployee(uuid, req.user.id)
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.remove(uuid, req.user.id)
  }
}
