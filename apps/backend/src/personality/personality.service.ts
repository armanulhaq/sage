import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Personality, PersonalityStatus } from './entities/personality.entity';
import { User } from '../user/entities/user.entity';
import { CreatePersonalityInput, PersonalityResponse } from 'contract';

@Injectable()
export class PersonalityService {
  constructor(private readonly em: EntityManager) {}

  async create(
    input: CreatePersonalityInput,
    creator: User,
  ): Promise<PersonalityResponse> {
    const status = input.isPublic
      ? PersonalityStatus.PENDING_APPROVAL
      : PersonalityStatus.PRIVATE;

    const personality = new Personality({
      name: input.name.trim(),
      bio: input.bio.trim(),
      avatar: input.avatar?.trim() || null,
      voiceTone: input.voiceTone?.trim() || null,
      status,
      creator,
    });

    this.em.persist(personality);
    await this.em.flush();

    return this.serializePersonality(personality);
  }

  // Returns:
  // 1. All public approved personalities (visible to everyone)
  // 2. Personalities created by the requesting user (their own private ones)
  async findAllAccessible(userId: string): Promise<PersonalityResponse[]> {
    const personalities = await this.em.find(
      Personality,
      {
        $or: [
          { status: PersonalityStatus.APPROVED },
          { creator: userId },
        ],
      },
      {
        orderBy: { createdAt: 'DESC' },
        populate: ['creator', 'sources'],
      },
    );

    return personalities.map((p) => this.serializePersonality(p));
  }

  async findById(id: string, userId: string): Promise<PersonalityResponse> {
    const personality = await this.em.findOne(
      Personality,
      { id },
      { populate: ['creator', 'sources'] },
    );

    if (!personality) {
      throw new NotFoundException('Personality not found');
    }

    // Access control: must be public approved OR owned by current user
    const isOwner = personality.creator.id === userId;
    const isApproved = personality.status === PersonalityStatus.APPROVED;

    if (!isApproved && !isOwner) {
      throw new NotFoundException('Personality not found');
    }

    return this.serializePersonality(personality);
  }

  private serializePersonality(personality: Personality): PersonalityResponse {
    return {
      id: personality.id,
      name: personality.name,
      bio: personality.bio,
      avatar: personality.avatar ?? null,
      voiceTone: personality.voiceTone ?? null,
      status: personality.status,
      creatorId: personality.creator.id,
      creatorName: personality.creator.name,
      sourcesCount: personality.sources?.length ?? 0,
      createdAt: personality.createdAt.toISOString(),
      updatedAt: personality.updatedAt.toISOString(),
    };
  }
}
