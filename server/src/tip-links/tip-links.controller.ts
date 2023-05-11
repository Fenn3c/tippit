import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { TipLinksService } from './tip-links.service';
import { CreateTipLinkDto } from './dto/create-tip-link.dto';
import { UpdateTipLinkDto } from './dto/update-tip-link.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('tip-links')
export class TipLinksController {
  constructor(private readonly tipLinksService: TipLinksService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  create(@Body() createTipLinkDto: CreateTipLinkDto, @UploadedFile() banner, @Req() req) {
    return this.tipLinksService.create(createTipLinkDto, req.user.id, banner);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Query('filter') filter: string, @Req() req) {
    return this.tipLinksService.findAllByUser(req.user.id, filter);
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  findOne(@Param('id') uuid: string) {
    return this.tipLinksService.findOneByUUID(uuid);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('banner'))
  update(@Param('id') uuid: string, @Body() updateTipLinkDto: UpdateTipLinkDto, @UploadedFile() banner, @Req() req) {
    return this.tipLinksService.update(uuid, updateTipLinkDto, req.user.id, banner);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') uuid: string, @Req() req) {
    return this.tipLinksService.remove(uuid, req.user.id);
  }
}
