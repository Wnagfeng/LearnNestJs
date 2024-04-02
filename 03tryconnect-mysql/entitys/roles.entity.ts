/*eslint-disable prettier/prettier*/
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from './user.entitys';
@Entity()
export class roles {
  // PrimaryGeneratedColumn()装饰器会自动生成一个id字段作为主键
  @PrimaryGeneratedColumn()
  id: number;
  // Column()装饰器用来定义字段
  @Column()
  name: string;

  //   @Column()
  //   userId: string;
  @ManyToMany(() => User, (users) => users.roles)
  users: User[];
}
