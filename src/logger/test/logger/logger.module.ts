import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { MyLogger } from './logger.service';

@Module({
	controllers: [LoggerController],
	providers: [MyLogger],
	exports: [MyLogger],
})
export class LoggerModule {}
