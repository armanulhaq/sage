import { Migration } from '@mikro-orm/migrations';

export class Migration20261019185913 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" text not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" text not null, "email" text not null, "password" text not null, "role" text check ("role" in ('USER', 'ADMIN')) not null default 'USER', constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

}
