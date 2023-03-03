import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'liveexchangedata',
})
export class CurrencyEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  time: string;

  @Column()
  rates: number;

  @Column()
  currency_base: string;

  @Column()
  currency_quote: string;

  @Column()
  type: string;
}

export type paginationResponse = {
  data: object;
  total: number;
  page: number;
  pageSize: number;
};
