import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService,
    private readonly configService: ConfigService) { }

  @Get('/commission-percent')
  getCommisionPercent(): number {
    return +this.configService.get('COMMISION_PERCENT')
  }

  @Get('/statistics/:period')
  @UseGuards(JwtAuthGuard)
  statistics(@Param('period') period: StatisticsPeriod, @Req() req) {
    return this.financeService.getStatistics(req.user.id, period);
  }

  @Get('/operations')
  @UseGuards(JwtAuthGuard)
  operations(@Req() req) {
    return this.financeService.getOperations(req.user.id);
  }

  @Get('/payout-data')
  @UseGuards(JwtAuthGuard)
  payoutData(@Req() req) {
    return this.financeService.getPayoutData(req.user.id);
  }


}
