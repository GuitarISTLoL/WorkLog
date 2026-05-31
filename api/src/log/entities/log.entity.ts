import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkTypeEntity } from '../../work-type/entities/work-type.entity';

@Entity({ name: 'logs' })
export class LogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  user: string;

  @ManyToOne(() => WorkTypeEntity, (workType) => workType.log)
  @JoinColumn()
  type: WorkTypeEntity;

  @Column({ type: 'float', unsigned: true })
  count: number;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  @Column({ type: 'timestamp with time zone' })
  complitedAt: Date;
}
