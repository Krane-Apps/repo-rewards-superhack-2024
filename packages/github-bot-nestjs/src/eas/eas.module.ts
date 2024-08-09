import { Module } from '@nestjs/common';
import { AttestationService } from './attestation.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
      {
        provide: 'Config',
        useFactory: (configService: ConfigService) => {
          return {
            baseSepoliaNet: configService.get<string>('ALCHEMY_BASE_SEPOLIA_URL'),
            optSepoliaNet: configService.get<string>('ALCHEMY_OPT_SEPOLIA_URL'),
            apiKey: configService.get<string>('ALCHEMY_API_KEY'),
            privateKey: configService.get<string>('PRIVATE_KEY'),
          };
        },
        inject: [ConfigService],
      },
      AttestationService],
      exports: [AttestationService]
})
export class EasModule {}
