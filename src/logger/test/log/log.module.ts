import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from 'src/jwt/jwt.module';

import { LogEntity } from './entities/log.entity';
import { LogController } from './log.controller';
import { LogScheduleService } from './services/log-schedule.service';

import { LogService } from './services/log.main.service';
import { BetterStackService } from './services/providers/log.betterstack.service';
import { LogDbService } from './services/providers/log.db.service';

@Module({
	imports: [TypeOrmModule.forFeature([LogEntity]), JwtModule],
	controllers: [LogController],
	providers: [
		LogService,
		LogScheduleService,
		LogDbService,
		BetterStackService,
	],
	exports: [LogService],
})
export class LogModule {}
