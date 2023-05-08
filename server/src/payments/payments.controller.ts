import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Get('/commission-percent')
  getCommisionPercent(): number {
    return +process.env.COMMISION_PERCENT
  }

  @Get('/operations')
  @UseGuards(JwtAuthGuard)
  operations(@Req() req) {
    return this.paymentsService.getOperations(req.user.id);
  }

  @Get('/statistcs/:period')
  @UseGuards(JwtAuthGuard)
  statistcs(@Param('period') period: StatisticsPeriod, @Req() req) {
    return this.paymentsService.getStatistics(req.user.id, period);
  }


  @Get('/confirm/:uuid')
  confirm(@Param('uuid') uuid: string) {
    return this.paymentsService.confirmPayment(uuid);
  }


  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(+id);
  }


}
