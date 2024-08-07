import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { WebhookController } from './webhook.controller';
import { Web3Module } from 'src/web3/web3.module';

@Module({
  imports:[Web3Module],
  providers: [BotService],
  controllers: [WebhookController]
})

export class BotModule {}
