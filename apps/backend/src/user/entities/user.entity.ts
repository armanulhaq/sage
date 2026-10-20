import { Entity, Enum, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseEntity {
  @Property()
  name: string;

  @Unique()
  @Property()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Enum({
    items: () => UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  constructor({
    name,
    email,
    password,
    role = UserRole.USER,
  }: {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
  }) {
    super();
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
