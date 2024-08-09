import { Module } from '@nestjs/common';
import { WorldcoinService } from './worldcoin.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
      {
        provide: 'Config',
        useFactory: (configService: ConfigService) => {
          return {
            app_id: configService.get<string>('WORLD_COIN_APP_ID'),
            action: configService.get<string>('WORLD_COIN_ACTION')
          };
        },
        inject: [ConfigService],
      },
      WorldcoinService],
    exports: [
      WorldcoinService
    ]
})
export class WorldcoinModule {}
