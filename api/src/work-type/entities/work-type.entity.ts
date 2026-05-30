import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { LogEntity } from '../../log/entities/log.entity';

@Entity({ name: 'workType' })
export class WorkTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  title: string;

  @OneToMany(() => LogEntity, (log) => log.type)
  log: LogEntity;

  @Column('text')
  unit: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;
}
