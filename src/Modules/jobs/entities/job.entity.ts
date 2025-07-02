import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Entity } from 'typeorm';

@Entity('job')
export class JobEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  company_name: string;

  @Column({ length: 255 })
  location: string;

  @Column('text')
  description: string;

  @Column({ length: 50 })
  employment_type:
    | 'Full-time'
    | 'Part-time'
    | 'Contract'
    | 'Internship'
    | 'Temporary';

  @Column('decimal', { precision: 10, scale: 2 })
  hourly_pay: number;

  @Column({ default: false })
  urgent_hiring: boolean;

  @Column({ default: false })
  remote_option: boolean;

  @Column({ length: 100, nullable: true })
  experience_required?: string;

  @Column({ length: 100, nullable: true })
  education_level?: string;

  @Column({ type: 'date', nullable: true })
  application_deadline?: Date;

  @CreateDateColumn({ type: 'timestamp' })
  posted_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
