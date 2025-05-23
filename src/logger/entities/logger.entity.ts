// import { BaseEntity } from 'src/common/entity/base-entity';
// import { Column, Entity } from 'typeorm';

// @Entity('log')
// export class Logger extends BaseEntity {
// 	@Column()
// 	action: string;

// 	@Column({ nullable: true })
// 	country: string | null;

// 	@Column({ nullable: true })
// 	city: string | null;

// 	@Column({ name: 'original_url', nullable: true, type: 'text' })
// 	originalUrl: string | null;

// 	@Column({ name: 'status_code', nullable: true })
// 	statusCode: number | null;

// 	@Column({ type: 'text', nullable: true })
// 	content: string | null;

// 	@Column({ nullable: true })
// 	response: string | null;

// 	@Column({ nullable: true })
// 	email: string | null;

// 	@Column({ name: 'user_creator_id', nullable: true })
// 	userCreatorId: string | null;

// 	@Column({ type: 'text', nullable: true })
// 	note: string | null;

// 	@Column()
// 	success: boolean;

// 	@Column({ name: 'user_agent', nullable: true })
// 	userAgent: string | null;
// }

import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('logger')
export class Logger extends BaseEntity {
	@Column({ type: 'varchar', default: '::1' })
	ip: string;

	@Column()
	method: string;

	@Column({ nullable: true })
	originalUrl: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	userAgent?: string;

	@Column({ type: 'boolean' })
	status: boolean;

	@Column({ type: 'varchar', length: 2000, nullable: true })
	content: string;

	@Column('text', { nullable: true })
	response?: string;

	@Column({ type: 'varchar', nullable: true })
	city: string;

	@Column({ type: 'varchar', nullable: true })
	country: string;
}
