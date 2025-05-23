import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Auth0WebhookGuard implements CanActivate {
	constructor(private readonly configService: ConfigService) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();
		const token = req.headers['authorization']?.replace('Bearer ', '');

		const secret = this.configService.get<string>('AUTH0_WEBHOOK_SECRET');

		if (!token || token !== secret) {
			throw new UnauthorizedException('Invalid webhook token');
		}
		return true;
	}
}
