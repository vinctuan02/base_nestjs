import { Body, Controller, Post } from '@nestjs/common';
import { ResponseSuccessDto } from 'src/common/dto/response.dto';
import { UserCreateDto } from 'src/user/dto/user.create.dto';
import { Public } from './decorators/auth.decorators';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@Post('register')
	async register(
		@Body() payload: UserCreateDto,
	): Promise<ResponseSuccessDto<string>> {
		await this.authService.register(payload);
		return new ResponseSuccessDto({
			message: 'Register successfully',
		});
	}

	@Public()
	@Post('login')
	async login(
		@Body() payload: AuthLoginDto,
	): Promise<ResponseSuccessDto<{ token: string }>> {
		const result = await this.authService.login(payload);
		return new ResponseSuccessDto({ data: result });
	}
}
