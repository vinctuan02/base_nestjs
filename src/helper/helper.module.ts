import { Module } from '@nestjs/common';
import { HelperController } from './helper.controller';
import { DateService } from './services/date.service';
import { JsonService } from './services/json.service';
import { PasswordService } from './services/password.service';

@Module({
	imports: [],
	controllers: [HelperController],
	providers: [DateService, PasswordService, JsonService],
	exports: [DateService, PasswordService, JsonService],
})
export class HelperModule {}
