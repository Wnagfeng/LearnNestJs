/*eslint-disable prettier/prettier*/
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entitys';
@Entity()
export class logs {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @Column()
  method: string;

  @Column()
  data: string;

  @Column()
  response: number;

  /* 
  这是因为在TypeORM中，通过使用@OneToOne装饰器，你告诉TypeORM你希望在数据库中实现一个一对一的关系。
  这个装饰器会触发TypeORM的ORM映射功能，从而自动创建外键约束在User表和logs表之间。同时，
  @JoinColumn装饰器指示TypeORM使用哪个列来连接两个表。因此，TypeORM会自动在logs表中创建一个user_id列，
  用于保存User表中的主键。这样，你可以在User表和logs表之间建立一对一的关系，轻松地查询和操作数据。
   */
  //   OneToOne为什么要返回一个实体类？
  //   因为在logs表中，有一个user_id列，它保存的是User表的主键。因此，当你查询logs表时，你需要同时查询User表，
  //   才能获取到完整的用户信息。因此，在logs表中，你需要一个OneToOne关系，它返回一个User实体类。
  @ManyToOne(() => User, (user) => user.logs)
  @JoinColumn()
  user: User;
}
