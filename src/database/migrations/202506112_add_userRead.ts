import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("read_list")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("user_id", "integer", (col) => col.notNull())
		.addColumn("book_id", "integer", (col) => col.notNull())
		.addColumn("status", "varchar(20)", (col) =>
			col.notNull().defaultTo(sql`'READING'`),
		)
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addForeignKeyConstraint("fk_user_id", ["user_id"], "users", ["id"], (fk) =>
			fk.onDelete("cascade").onUpdate("cascade"),
		)
		.addForeignKeyConstraint("fk_book_id", ["book_id"], "books", ["id"], (fk) =>
			fk.onDelete("cascade").onUpdate("cascade"),
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("read_list").execute();
}
