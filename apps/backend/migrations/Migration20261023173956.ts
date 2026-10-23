import { Migration } from '@mikro-orm/migrations';

export class Migration20261023173956 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create extension if not exists vector;`);
    this.addSql(`create table "personality" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "bio" text not null, "avatar" text null, "voice_tone" text null, "status" text check ("status" in ('PRIVATE', 'APPROVED')) not null default 'PRIVATE', "creator_id" text not null, constraint "personality_pkey" primary key ("id"));`);

    this.addSql(`create table "personality_source" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "personality_id" text not null, "title" text not null, "source_type" text check ("source_type" in ('BOOK', 'SPEECH', 'ARTICLE', 'INTERVIEW', 'LETTER', 'ESSAY', 'CUSTOM_TEXT')) not null default 'CUSTOM_TEXT', "source_url" text null, "content" text not null, constraint "personality_source_pkey" primary key ("id"));`);

    this.addSql(`create table "personality_chunk" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "personality_id" text not null, "source_id" text not null, "content" text not null, "chunk_index" int not null default 0, "embedding" vector(768) null, constraint "personality_chunk_pkey" primary key ("id"));`);

    this.addSql(`alter table "personality" add constraint "personality_creator_id_foreign" foreign key ("creator_id") references "user" ("id") on update cascade;`);

    this.addSql(`alter table "personality_source" add constraint "personality_source_personality_id_foreign" foreign key ("personality_id") references "personality" ("id") on update cascade;`);

    this.addSql(`alter table "personality_chunk" add constraint "personality_chunk_personality_id_foreign" foreign key ("personality_id") references "personality" ("id") on update cascade;`);
    this.addSql(`alter table "personality_chunk" add constraint "personality_chunk_source_id_foreign" foreign key ("source_id") references "personality_source" ("id") on update cascade;`);
  }

}
