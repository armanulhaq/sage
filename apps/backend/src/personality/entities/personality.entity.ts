import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { PersonalitySource } from './personality-source.entity';

export enum PersonalityStatus {
  PRIVATE = 'PRIVATE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
}

@Entity()
export class Personality extends BaseEntity {
  @Property()
  name: string; 

  @Property({ type: 'text' })
  bio: string;

  @Property({ nullable: true })
  avatar?: string | null;

  @Property({ type: 'text', nullable: true })
  voiceTone?: string | null; // specific tone nuances (e.g. "poetic, contemplative")

  @Enum({
    items: () => PersonalityStatus,
    default: PersonalityStatus.PRIVATE,
  })
  status: PersonalityStatus = PersonalityStatus.PRIVATE;

  @ManyToOne(() => User)
  creator: User;

  @OneToMany(() => PersonalitySource, (source) => source.personality)
  sources = new Collection<PersonalitySource>(this);

  constructor({
    name,
    bio,
    avatar,
    voiceTone,
    status = PersonalityStatus.PRIVATE,
    creator,
  }: {
    name: string;
    bio: string;
    avatar?: string | null;
    voiceTone?: string | null;
    status?: PersonalityStatus;
    creator: User;
  }) {
    super();
    this.name = name;
    this.bio = bio;
    this.avatar = avatar ?? null;
    this.voiceTone = voiceTone ?? null;
    this.status = status;
    this.creator = creator;
  }
}
