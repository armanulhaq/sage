import { Migration } from '@mikro-orm/migrations';

export class Migration20261020085729 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "user" add column "google_id" text null, add column "avatar" text null;`);
    this.addSql(`alter table "user" alter column "password" type text using ("password"::text);`);
    this.addSql(`alter table "user" alter column "password" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "user" alter column "password" type text using ("password"::text);`);
    this.addSql(`alter table "user" alter column "password" set not null;`);
  }

}
