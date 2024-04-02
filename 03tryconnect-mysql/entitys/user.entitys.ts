/*eslint-disable prettier/prettier*/
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { logs } from './logs.entitys';
import { roles } from './roles.entity';
import { profile } from './profile.entity';

@Entity()
export class User {
  // PrimaryGeneratedColumn()装饰器会自动生成一个id字段作为主键
  @PrimaryGeneratedColumn()
  id: number;
  // Column()装饰器用来定义字段
  @Column()
  username: string;

  @Column()
  password: string;

  // 一个用户对应多个日志 一对多关系
  @OneToMany(() => logs, (logs) => logs.user)
  logs: logs[];

  @ManyToMany(() => roles, (roles) => roles.users)
  @JoinTable({ name: 'user_roles' })
  roles: roles[];

  @OneToMany(() => profile, (Profile) => Profile.user)
  profile: profile[];
}
