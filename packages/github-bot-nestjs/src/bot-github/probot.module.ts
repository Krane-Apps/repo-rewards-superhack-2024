import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { WebhookController } from './webhook.controller';
import { Web3Module } from 'src/web3/web3.module';
import { EasModule } from 'src/eas/eas.module';
import { WorldcoinModule } from 'src/worldcoin/worldcoin.module';

@Module({
  imports:[Web3Module, EasModule, WorldcoinModule],
  providers: [BotService],
  controllers: [WebhookController]
})

export class BotModule {}
