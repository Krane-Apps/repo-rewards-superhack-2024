import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule.forRoot({
        isGlobal: true,
    }),
    ConfigModule
  ],
  providers: [
    {
      provide: 'Config',
      useFactory: (configService: ConfigService) => {
        return {
          baseMainNet: configService.get<string>('ALCHEMY_BASE_MAINNET_URL'),
          baseSepoliaNet: configService.get<string>('ALCHEMY_BASE_SEPOLIA_URL'),
          zoraSepoliaNet: configService.get<string>('ALCHEMY_ZORA_SEPOLIA_URL'),
          optSepoliaNet: configService.get<string>('ALCHEMY_OPT_SEPOLIA_URL'),
          apiKey: configService.get<string>('ALCHEMY_API_KEY'),
          contractAbi: JSON.parse(configService.get<string>('CONTRACT_ABI')),
          contractAddress: configService.get<string>('CONTRACT_ADDRESS'),
        };
      },
      inject: [ConfigService],
    },
    Web3Service],
    exports: [Web3Service]
})
export class Web3Module {}
