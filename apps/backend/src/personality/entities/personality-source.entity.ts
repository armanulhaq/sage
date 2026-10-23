import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Personality } from './personality.entity';
import { PersonalityChunk } from './personality-chunk.entity';

export enum SourceType {
  BOOK = 'BOOK',
  SPEECH = 'SPEECH',
  ARTICLE = 'ARTICLE',
  INTERVIEW = 'INTERVIEW',
  LETTER = 'LETTER',
  ESSAY = 'ESSAY',
  CUSTOM_TEXT = 'CUSTOM_TEXT',
}

@Entity()
export class PersonalitySource extends BaseEntity {
  @ManyToOne(() => Personality)
  personality: Personality;

  @Property()
  title: string;

  @Enum({
    items: () => SourceType,
    default: SourceType.CUSTOM_TEXT,
  })
  sourceType: SourceType = SourceType.CUSTOM_TEXT;

  @Property({ nullable: true })
  sourceUrl?: string | null;

  @Property()
  content: string;

  @OneToMany(() => PersonalityChunk, (chunk) => chunk.source)
  chunks = new Collection<PersonalityChunk>(this);

  constructor({
    personality,
    title,
    sourceType = SourceType.CUSTOM_TEXT,
    sourceUrl,
    content,
  }: {
    personality: Personality;
    title: string;
    sourceType?: SourceType;
    sourceUrl?: string | null;
    content: string;
  }) {
    super();
    this.personality = personality;
    this.title = title;
    this.sourceType = sourceType;
    this.sourceUrl = sourceUrl ?? null;
    this.content = content;
  }
}
