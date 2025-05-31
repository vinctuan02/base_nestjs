import { BaseEntity } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { LevelLog } from '../enum/log.enum';

@Entity('log')
export class LogEntity extends BaseEntity {
	@Column()
	action: string;

	@Column({ nullable: true })
	ip: string;

	@Column({ nullable: true })
	country: string;

	@Column({ nullable: true })
	city: string;

	@Column({ name: 'original_url', nullable: true, type: 'text' })
	originalUrl: string;

	@Column({ name: 'status_code', nullable: true })
	statusCode: number;

	@Column({ type: 'text', nullable: true })
	content: string;

	@Column({ type: 'mediumtext', nullable: true })
	response: string;

	@Column({ nullable: true })
	email: string;

	@Column({ name: 'user_creator_id', nullable: true })
	userCreatorId: string;

	@Column({ type: 'text', nullable: true })
	note: string;

	@Column()
	success: boolean;

	@Column({ name: 'user_agent', nullable: true })
	userAgent: string;

	@Column({ type: 'enum', enum: LevelLog, nullable: true })
	level: LevelLog;
}
