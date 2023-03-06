import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CurrencyEntity } from './currency.entity';
import { CurrencyRepository } from './currency.repository';
import { CurrencyService } from './currency.service';

const getAllExchangesMock = jest.fn();

const mockCardRepository = () => ({
  getAll: jest.fn(),
  query: jest.fn(),
  create: jest.fn(),
  findAndCount: jest.fn(),
  getAllExchanges: getAllExchangesMock,
});

const mockCard = [
  {
    time: '2023-03-02T20:36:49.0000000Z',
    rates: 0.07022440970625726,
    currency_base: 'ETH',
    currency_quote: 'BTC',
    type: 'Live Price',
    id: 'df432cc7-4387-4538-a8fa-66be59f202b0',
  },
];

const entities = [new CurrencyEntity(), new CurrencyEntity()];
const totalItems = entities.length;
// const pagination: Pagination<CurrencyEntity> = {
//   items: entities,
//   // links: [],
//   // meta: {
//   //   data: totalItems,
//   //   total: totalItems,
//   //   itemsPerPage: totalItems,
//   //   pageSize: 1,
//   //   page: 1,
//   //   // data: entities,
//   //   // total: totalItems,
//   //   // page: 1,
//   //   // pageSize: 1,
//   // },
// };
describe('CurrencyService', () => {
  let currencyService: CurrencyService;
  let currencyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrencyService,
        { provide: CurrencyRepository, useFactory: mockCardRepository },
      ],
    }).compile();

    currencyService = module.get<CurrencyService>(CurrencyService);
    currencyRepository = module.get(CurrencyRepository);
  });

  describe('getAllExchanges', () => {
    it('calls the CurrencyRepository.getAllExchanges and return the result', async () => {
      currencyRepository.getAllExchanges.mockReturnValueOnce(Pagination);
      const result = await currencyService.getAllExchanges();
      expect(result).toBe(Pagination);
      expect(getAllExchangesMock).toBeCalled();
    });
    it('calls the CurrencyRepository.getAllExchanges and handles an error', async () => {
      currencyRepository.getAllExchanges.mockReturnValueOnce(undefined);
      await expect(currencyService.getAllExchanges()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('saveLiveExchange', () => {
    it('calls CurrencyRepository.saveLiveExchange and returns the result', async () => {
      currencyRepository.saveLiveExchange.mockReturnValueOnce(mockCard);
      const result = await currencyService.getLiveCurrencyRate();
      expect(result).toEqual(mockCard);
    });
    it('calls the CurrencyRepository.saveLiveExchange and handles an error', async () => {
      currencyRepository.saveLiveExchange.mockReturnValueOnce([]);
      await expect(currencyService.getLiveCurrencyRate()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getCurrencyExchange', () => {
    it('calls the CardsRepository.create and returns the result', async () => {
      currencyRepository.saveCurrencyExchange.mockReturnValueOnce([]);
      const result = await currencyService.getCurrencyExchange(
        'BTC',
        'USD',
        200,
      );
      expect(result).toEqual(mockCard[0]);
    });
    it('calls the CardsRepository.create and handles an error', async () => {
      currencyRepository.saveCurrencyExchange.mockReturnValueOnce([
        mockCard[0],
      ]);
      await expect(
        currencyService.getCurrencyExchange('BTC', 'USD', 200),
      ).rejects.toThrowError(ConflictException);
    });
  });
});
