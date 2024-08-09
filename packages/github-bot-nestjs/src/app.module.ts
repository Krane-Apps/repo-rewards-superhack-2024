import { Module } from '@nestjs/common';
import { BotModule } from './bot-github/probot.module';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';
import { EasModule } from './eas/eas.module';
import { WorldcoinModule } from './worldcoin/worldcoin.module';

@Module({
  imports: [
    BotModule,
    ConfigModule.forRoot(), Web3Module, EasModule, WorldcoinModule,
  ]
})
export class AppModule {}
