import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async create(data: {
    name: string;
    email: string;
    password?: string | null;
    googleId?: string | null;
    avatar?: string | null;
    role?: UserRole;
  }): Promise<User> {
    const user = new User({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      password: data.password,
      googleId: data.googleId,
      avatar: data.avatar,
      role: data.role ?? UserRole.USER,
    });

    this.em.persist(user)
    await this.em.flush();
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.em.findOne(User, { email: email.toLowerCase().trim() });
  }

  async findById(id: string): Promise<User | null> {
    return this.em.findOne(User, { id });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.em.findOne(User, { googleId });
  }
}
