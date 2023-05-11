import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { CreatePayoutDto } from './dto/create-payout.dto';
import { UpdatePayoutDto } from './dto/update-payout.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payouts')
export class PayoutsController {
  constructor(private readonly payoutsService: PayoutsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPayoutDto: CreatePayoutDto, @Req() req) {
    return this.payoutsService.create(createPayoutDto, req.user.id);
  }

  @Get()
  findAll() {
    return this.payoutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.payoutsService.findOne(+id);
  }

}
