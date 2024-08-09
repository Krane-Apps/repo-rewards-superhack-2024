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
          baseSepoliaNet: configService.get<string>('ALCHEMY_BASE_SEPOLIA_URL'),
          zoraSepoliaNet: configService.get<string>('ALCHEMY_ZORA_SEPOLIA_URL'),
          optSepoliaNet: configService.get<string>('ALCHEMY_OPT_SEPOLIA_URL'),
          apiKey: configService.get<string>('ALCHEMY_API_KEY'),
          contractAddressBase: configService.get<string>('CONTRACT_ADDRESS_BASE'),
          contractAddressOpt: configService.get<string>('CONTRACT_ADDRESS_OPT'),
          privateKey: configService.get<string>('PRIVATE_KEY'),
        };
      },
      inject: [ConfigService],
    },
    Web3Service],
    exports: [Web3Service]
})
export class Web3Module {}
