import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrencyEntity } from './currency.entity';
import { CurrencyService } from './currency.service';

@ApiTags('currency')
@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Get('/:currency')
  @ApiOperation({ summary: 'Get Live Currency Exchange' })
  @ApiResponse({
    description: 'return all live exchange',
    type: CurrencyEntity,
  })
  getLiveCurrencyRate() {
    return this.currencyService.getLiveCurrencyRate();
  }

  @Get()
  @ApiOperation({ summary: 'Get All Currency Exchange In The Database' })
  @ApiResponse({ description: 'return all records', type: CurrencyEntity })
  getAllCurrency() {
    return this.currencyService.getAllExchanges();
  }

  @Get('/:currencyBase/:currencyQuote/:amount')
  @ApiOperation({ summary: 'Exchange Currencies' })
  @ApiResponse({
    description: 'return response of the exchange made by the user',
    type: CurrencyEntity,
  })
  getCurrencyExchange(
    @Param('currencyBase') currencyBase: string,
    @Param('currencyQuote') currencyQuote: string,
    @Param('amount') amount: number,
  ): Promise<CurrencyEntity[]> {
    return this.currencyService.getCurrencyExchange(
      currencyBase,
      currencyQuote,
      amount,
    );
  }
}
