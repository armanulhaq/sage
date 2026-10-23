import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { BaseEntity } from '../../entities/base.entity';
import { Personality } from './personality.entity';
import { PersonalitySource } from './personality-source.entity';

@Entity()
export class PersonalityChunk extends BaseEntity {
  @ManyToOne(() => Personality)
  personality: Personality;

  @ManyToOne(() => PersonalitySource)
  source: PersonalitySource;

  @Property()
  content: string;

  @Property({ default: 0 })
  chunkIndex: number = 0; // Sequence order of this chunk in the original document

  @Property({ columnType: 'vector(768)', nullable: true })
  embedding?: string | null; // 768-dim vector embedding (matches Google Gemini text-embedding-004)

  constructor({
    personality,
    source,
    content,
    chunkIndex = 0,
    embedding,
  }: {
    personality: Personality;
    source: PersonalitySource;
    content: string;
    chunkIndex?: number;
    embedding?: string | null;
  }) {
    super();
    this.personality = personality;
    this.source = source;
    this.content = content;
    this.chunkIndex = chunkIndex;
    this.embedding = embedding ?? null;
  }
}
