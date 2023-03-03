import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pagination } from 'nestjs-typeorm-paginate';
import { CurrencyEntity } from './currency.entity';
import { CurrencyRepository } from './currency.repository';
import { CurrencyService } from './currency.service';

const mockCardRepository = () => ({
  getAll: jest.fn(),
  query: jest.fn(),
  create: jest.fn(),
  findAndCount: jest.fn(),
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
      currencyRepository.getAllExchanges.mockReturnValueOnce();
      const result = await currencyService.getAllExchanges();
      expect(result).toBe(Pagination);
      expect(currencyRepository.getAllExchanges()).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
    });
    it('calls the CurrencyRepository.getAllExchanges and handles an error', async () => {
      currencyRepository.getAllExchanges.mockReturnValueOnce({});
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

// import { Pagination } from 'nestjs-typeorm-paginate';
// import { Repository } from 'typeorm';
// import { CurrencyController } from './currency.controller';
// import { CurrencyEntity } from './currency.entity';
// import { CurrencyService } from './currency.service';

// describe('MyController', () => {
//   let controller: CurrencyController;
//   let currencyService: CurrencyService;
//   let currencyRepository: Repository<CurrencyEntity>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CurrencyController],
//       providers: [
//         CurrencyService,
//         {
//           provide: getRepositoryToken(CurrencyEntity),
//           useValue: {
//             findAndCount: jest.fn(),
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<CurrencyController>(CurrencyController);
//     currencyService = module.get<CurrencyService>(CurrencyService);
//     currencyRepository = module.get<Repository<CurrencyEntity>>(
//       getRepositoryToken(CurrencyEntity),
//     );
//   });

//   describe('findAll', () => {
//     it('should return a pagination object of MyEntity instances', async () => {
//       const entities = [new CurrencyEntity(), new CurrencyEntity()];
//       const totalItems = entities.length;
//       const pagination: Pagination<CurrencyEntity> = {
//         items: entities,
//         // links: [],
//         meta: {
//           itemCount: totalItems,
//           totalItems,
//           itemsPerPage: totalItems,
//           totalPages: 1,
//           currentPage: 1,
//         },
//       };
//       jest
//         .spyOn(currencyService, 'getAllExchanges')
//         .mockResolvedValue(pagination);

//       const result = await controller.getAllCurrency();

//       expect(result).toBe(pagination);
//       expect(currencyService.getAllExchanges).toHaveBeenCalledWith({
//         page: 1,
//         limit: 10,
//       });
//     });

//     it('should use the provided page and limit parameters in the query', async () => {
//       const page = 2;
//       const limit = 20;
//       jest
//         .spyOn(currencyService, 'getAllExchanges')
//         .mockResolvedValue({} as Pagination<CurrencyEntity>);

//       await controller.getAllCurrency();

//       expect(currencyService.getAllExchanges).toHaveBeenCalledWith({
//         page,
//         limit,
//       });
//     });
//   });
// });
