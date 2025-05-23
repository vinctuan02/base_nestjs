import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { TypeID } from '../typeorm/enum/db-type.enum';

export class BaseDateEntity {
	@CreateDateColumn({ name: 'created_at', type: 'timestamptz', precision: 0 })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', precision: 0 })
	updatedAt: Date;
}

export class BaseEntity extends BaseDateEntity {
	@PrimaryGeneratedColumn()
	id: TypeID;
}
