import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { CurrencyEntity } from 'src/currency/currency.entity';
import { CurrencyRepository } from 'src/currency/currency.repository';
import { Server } from 'ws';

@WebSocketGateway()
export class AppGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly databaseService: CurrencyRepository) {}

  async handleNewValueAddedToDatabase() {
    const newValue = await this.databaseService.getAllExchanges();
    this.server.emit('new-value-added', newValue);
  }
}
