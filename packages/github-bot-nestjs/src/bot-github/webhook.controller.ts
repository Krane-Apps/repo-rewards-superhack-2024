import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { BotService } from './bot.service';
import { Request, Response } from 'express';

@Controller('webhook')
export class WebhookController {

    constructor(private botService: BotService) {}

    @Post()
    async handleWebhook(@Req() req: Request, @Res() res: Response): Promise<any> {
        try {
            const id = req.headers['x-github-delivery'] as string;
            const name = req.headers['x-github-event'] as string;
            const payload = req.body;
            const body = JSON.parse(JSON.stringify(payload));
            console.log(`Recived a New Webhook: ${name} ${body.action}`);
            if(name === 'issues' && body.action === 'closed') {
                await this.botService.handleIssueClosed(id, name, body);
            }
            return 'OK';
        } catch (error) {
            console.error('Error processing webhook:', error);
            return 'Error processing webhook';
        }
    }

    @Get('status')
    async getServerStatus() {
        return 'OK';
    }
}