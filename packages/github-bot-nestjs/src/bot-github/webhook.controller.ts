import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { BotService } from './bot.service';
import { Request, Response } from 'express';
import { WorldcoinService } from 'src/worldcoin/worldcoin.service';
import { Observable } from 'rxjs';
import { AttestationService } from 'src/eas/attestation.service';

@Controller('webhook')
export class WebhookController {

    constructor(
        private botService: BotService,
        private worldcoinService: WorldcoinService,
        private attestationService: AttestationService
    ) {}

    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const id = req.headers['x-github-delivery'] as string;
            const name = req.headers['x-github-event'] as string;
            const payload = req.body;
            const body = JSON.parse(JSON.stringify(payload));
            console.log(`Recived a New Webhook: ${name} ${body.action}`);
            if(name === 'issues' && body.action === 'closed') {
                this.botService.handleIssueClosed(id, name, body);
            }
            return 'OK';
        } catch (error) {
            console.error('WebhookController, Error processing webhook:', error);
            return 'Error processing webhook';
        }
    }

    @Post('worldIdVerification')
    async handleWorldIdVerification(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const proof = req.body
            this.worldcoinService.handleWorldIdVerification(proof, res);
        } catch(error) {
            console.error('WebhookController, Error verifying worldcoindId:', error);
        }
    };

    @Get('attestationRecipient/:recipient')
    async getAttestations(@Param('recipient') recipient: string): Promise<any> {
        return await this.attestationService.getAttestationsByRecipient(recipient);
    }

    @Get('attestationAttester/:attester')
    async getAttestationsByAttester(@Param('attester') attester: string): Promise<any> {
        return this.attestationService.getAttestationsByAttester(attester);
    }

    @Get('status')
    async getServerStatus() {
        return 'OK';
    }

}