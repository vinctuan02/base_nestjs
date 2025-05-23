import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { Public } from 'src/auth/decorators/auth.decorators';
import { Auth0WebhookGuard } from 'src/auth/guards/auth0.webhook.guard';
import { Auth0Service } from './auth0.service';
import { LoginEventBody } from './interfaces/auth0.interface';

@Controller('auth0')
export class Auth0Controller {
	constructor(private readonly auth0Service: Auth0Service) {}

	@Post('webhook')
	@HttpCode(200)
	@Public()
	@UseGuards(Auth0WebhookGuard)
	async handleWebhook(@Body() body: LoginEventBody) {
		return await this.auth0Service.handleWebhook(body);
	}
}
