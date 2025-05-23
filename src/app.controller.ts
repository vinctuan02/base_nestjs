import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
	@Get()
	helloWord() {
		return 'hello word';
	}
}
