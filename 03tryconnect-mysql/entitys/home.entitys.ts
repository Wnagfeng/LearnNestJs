/*eslint-disable prettier/prettier*/
// 这是User实体的定义文件
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class home {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
