import { Repository } from 'typeorm';
import { CurrencyEntity, paginationResponse } from './currency.entity';
import axios from 'axios';
import { Logger, NotFoundException, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { response } from 'express';

export class CurrencyRepository {
  private readonly logger = new Logger(CurrencyRepository.name);
  constructor(
    @InjectRepository(CurrencyEntity)
    private currencyEntity: Repository<CurrencyEntity>,
  ) {}

  async getAllExchanges(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): // @WebSocketServer() server: Server,
  Promise<paginationResponse> {
    try {
      const [rows, count] = await this.currencyEntity.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!rows || count === 0) {
        throw new NotFoundException('No Live Rates Found');
      }
      // server.emit('newDataAdded', rates);
      return {
        data: rows,
        total: count,
        page: page,
        pageSize: limit,
      };
    } catch (error) {
      this.logger.log(error);
    }
  }

  async saveLiveRate(): Promise<any> {
    const currencyBase = ['BTC', 'ETH', 'USD'];
    try {
      currencyBase.map(async (element) => {
        const options = {
          method: 'GET',
          url: `${process.env.X_COINAPI_URL}/${element}?invert={invert}&filter_asset_id=BTC,ETH,GBP,USD`,
          headers: {
            'X-CoinAPI-Key': process.env.X_COINAPI_KEY,
          },
        };
        console.log(options, 'ops');
        const getCurrencyTypes = await axios(options);
        if (!getCurrencyTypes) {
          throw new NotFoundException('No Live Rates Found');
        }
        await this.currencyEntity.save({
          time: getCurrencyTypes.data.rates[0].time,
          rates: getCurrencyTypes.data.rates[0].rate,
          currency_base: getCurrencyTypes.data.asset_id_base,
          currency_quote: getCurrencyTypes.data.rates[0].asset_id_quote,
          type: 'Live Price',
        });
      });
      return;
    } catch (error) {
      this.logger.log(error);
    }
  }

  async saveCurrencyExchange(
    currencyBase: string,
    currencyQuote: string,
    amount: number,
  ): Promise<any> {
    try {
      const options = {
        method: 'GET',
        url: `${process.env.X_COINAPI_URL}/${currencyBase}?invert=false&filter_asset_id=${currencyQuote}`,
        headers: {
          'X-CoinAPI-Key': process.env.X_COINAPI_KEY,
        },
      };

      const getCurrencyExchange = await axios(options);
      if (!getCurrencyExchange) {
        throw new NotFoundException('No Currency Exchange Found');
      }
      const saveData = {
        time: getCurrencyExchange.data.rates[0].time,
        rates: getCurrencyExchange.data.rates[0].rate * amount,
        currency_base: getCurrencyExchange.data.asset_id_base,
        currency_quote: getCurrencyExchange.data.rates[0].asset_id_quote,
        type: 'Exchanged Price',
      };

      const result = await this.currencyEntity.save(saveData);
      return result;
    } catch (error) {
      this.logger.log(error);
    }
  }
}
