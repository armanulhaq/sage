import { Migration } from '@mikro-orm/migrations';

export class Migration20261023174619 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "personality" drop constraint if exists "personality_status_check";`);

    this.addSql(`alter table "personality" add constraint "personality_status_check" check("status" in ('PRIVATE', 'PENDING_APPROVAL', 'APPROVED'));`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "personality" drop constraint if exists "personality_status_check";`);

    this.addSql(`alter table "personality" add constraint "personality_status_check" check("status" in ('PRIVATE', 'APPROVED'));`);
  }

}
