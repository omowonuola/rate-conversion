import { Injectable } from '@nestjs/common';
import { CurrencyRepository } from './currency.repository';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CurrencyService {
  constructor(private readonly currencyRepository: CurrencyRepository) {}

  getAllExchanges(): Promise<any> {
    return this.currencyRepository.getAllExchanges();
  }

  // use a cron job to update the database every 15mins
  // @Cron('15 * * * * * *')
  getLiveCurrencyRate(): Promise<any> {
    return this.currencyRepository.saveLiveRate();
  }

  getCurrencyExchange(
    currencyBase: string,
    currencyQuote: string,
    amount: number,
  ): Promise<any> {
    return this.currencyRepository.saveCurrencyExchange(
      currencyBase,
      currencyQuote,
      amount,
    );
  }
}
