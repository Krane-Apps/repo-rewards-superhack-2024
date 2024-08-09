import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class WorldcoinService {

    constructor(
        @Inject('Config')
        private readonly config: {
          action: string;
          app_id: string
        }) {}

    async handleWorldIdVerification(proof: any, res: any) {
        try {
            const response = await fetch(
              `https://developer.worldcoin.org/api/v1/verify/app_${this.config.app_id}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...proof, action: this.config.action}),
              }
            );
            if (response.ok) {
              const resVerficication = await response.json();
              console.log('verified', resVerficication);
              res.status(200).send(resVerficication);
            } else {
              const { code, detail } = await response.json();
              console.log(detail);
              res.status(400).send('verified error', detail);
            }
          } catch(error) {
            console.error('WorldcoinService Error: ', error);
          }
        }
    }