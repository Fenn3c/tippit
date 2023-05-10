import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async create(@Body() createOrganizationDto: CreateOrganizationDto, @UploadedFile() banner, @Req() req) {
    return await this.organizationsService.create(createOrganizationDto, req.user.id, banner);
    return 1
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req) {
    return await this.organizationsService.findAll(req.user.id);
  }

  @Get(':uuid')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.findOneByUUID(uuid, req.user.id);
  }

  @Patch(':uuid')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  async update(@Param('uuid') uuid: string, @Body() updateOrganizationDto: UpdateOrganizationDto, @UploadedFile() banner, @Req() req) {
    return await this.organizationsService.update(uuid, updateOrganizationDto, req.user.id, banner);
  }

  @Delete(':uuid')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('uuid') uuid: string, @Req() req) {
    return await this.organizationsService.remove(uuid, req.user.id)
  }
}
