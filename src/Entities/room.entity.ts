import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column('float')
  price: number;

  @Column({ name: 'roomtype' }) // matches "roomtype" in DB
  roomType: string;

  @Column('text', { array: true })
  amenities: string[];

  @Column({ name: 'isavailable', default: true }) // matches "isavailable" in DB
  isAvailable: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
