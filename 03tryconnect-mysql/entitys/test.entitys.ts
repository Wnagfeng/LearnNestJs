/*eslint-disable prettier/prettier*/
// 通过实例类创建数据表
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
