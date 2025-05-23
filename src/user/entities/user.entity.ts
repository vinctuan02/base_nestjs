import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity, Unique } from 'typeorm';
import { RoleUser } from '../enum/user.enums';

@Entity('user')
@Unique(['email'])
export class User extends BaseEntity {
	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ name: 'first_name' })
	firstName: string;

	@Column({ name: 'last_name' })
	lastName: string;

	@Column({ enum: RoleUser, default: RoleUser.USER })
	role: RoleUser;

	@Column({ default: true })
	isActive: boolean;
}
