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

  // Handles Google login resolution across 3 realistic scenarios:
  // 1. Returning user: already linked with this googleId -> return existing user.
  // 2. Existing user: signed up earlier with email/password -> link googleId to existing account.
  // 3. Brand new user: create new user without password and save to database.
  async findOrCreateGoogleUser(data: {
    googleId: string;
    email: string;
    name: string;
    avatar?: string | null;
  }): Promise<User> {
    // Scenario 1: User already logged in with Google before
    let user = await this.findByGoogleId(data.googleId);
    if (user) {
      if (data.avatar && user.avatar !== data.avatar) {
        user.avatar = data.avatar;
        await this.em.flush();
      }
      return user;
    }

    // Scenario 2: User registered with email/password, now logging in with Google for first time
    user = await this.findByEmail(data.email);
    if (user) {
      user.googleId = data.googleId;
      if (!user.avatar && data.avatar) {
        user.avatar = data.avatar;
      }
      await this.em.flush();
      return user;
    }

    // Scenario 3: Brand new user
    return this.create({
      name: data.name,
      email: data.email,
      googleId: data.googleId,
      avatar: data.avatar,
      role: UserRole.USER,
    });
  }
}
