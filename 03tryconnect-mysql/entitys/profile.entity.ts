/*eslint-disable prettier/prettier*/
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entitys';
@Entity()
export class profile {
  // PrimaryGeneratedColumn()装饰器会自动生成一个id字段作为主键
  @PrimaryGeneratedColumn()
  id: number;
  // Column()装饰器用来定义字段
  @Column()
  gender: string;

  @Column()
  photo: string;

  @Column()
  address: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
