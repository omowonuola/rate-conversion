import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyController } from './currency.controller';
import { CurrencyEntity } from './currency.entity';
import { CurrencyRepository } from './currency.repository';
import { CurrencyService } from './currency.service';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity])],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyRepository],
})
export class CurrencyModule {}
