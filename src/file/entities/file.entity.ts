import { DEFAULT_LENGTH_VARCHAR } from 'src/common/constants/constants';
import { BaseEntity } from 'src/common/entity/base-entity';
import { Column, Entity } from 'typeorm';

@Entity('files')
export class File extends BaseEntity {
  @Column({
    name: 'endpoint',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  endpoint: string;

  @Column({
    name: 'access_key',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  accessKey: string;

  @Column({
    name: 'secret_key',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  secretKey: string;

  @Column({
    name: 'bucket_name',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  bucketName: string;

  @Column({
    name: 'file_name',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  fileName: string;

  @Column({
    name: 'file_type',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  fileType: string;

  @Column({ name: 'file_size', type: 'int', nullable: false })
  fileSize: number;

  @Column({
    name: 'key',
    type: 'varchar',
    length: DEFAULT_LENGTH_VARCHAR,
    nullable: false,
  })
  key: string;
}
