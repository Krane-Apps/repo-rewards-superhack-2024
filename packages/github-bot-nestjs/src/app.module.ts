import { Module } from '@nestjs/common';
import { BotModule } from './bot-github/probot.module';
import { ConfigModule } from '@nestjs/config';
import { Web3Module } from './web3/web3.module';

@Module({
  imports: [
    BotModule,
    ConfigModule.forRoot(), Web3Module,
  ]
})
export class AppModule {}
