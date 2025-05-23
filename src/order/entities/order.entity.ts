import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('orders')
export class Order extends BaseEntity {
	@Column({ type: 'timestamptz', precision: 0 })
	deadline: Date;
}
