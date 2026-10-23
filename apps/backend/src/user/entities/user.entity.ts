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

  @Property({ hidden: true, nullable: true })
  password?: string | null;

  @Property({ nullable: true })
  googleId?: string | null;

  @Property({ nullable: true })
  avatar?: string | null;

  @Enum({
    items: () => UserRole,
    default: UserRole.USER,
  })
  role: UserRole = UserRole.USER;

  constructor({
    name,
    email,
    password,
    googleId,
    avatar,
    role = UserRole.USER,
  }: {
    name: string;
    email: string;
    password?: string | null;
    googleId?: string | null;
    avatar?: string | null;
    role?: UserRole;
  }) {
    super();
    this.name = name;
    this.email = email;
    this.password = password ?? null;
    this.googleId = googleId ?? null;
    this.avatar = avatar ?? null;
    this.role = role;
  }
}
