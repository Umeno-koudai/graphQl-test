import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("users")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("name", "varchar(255)", (col) => col.notNull())
		.addColumn("email", "varchar(255)", (col) => col.notNull().unique())
		.addColumn("password_hash", "varchar(255)", (col) => col.notNull())
		.addColumn("role", "varchar(50)", (col) => col.notNull().defaultTo("user"))
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.execute();

	await db.schema
		.createTable("authors")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("name", "varchar(255)", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.execute();

	// 書籍テーブルの作成
	await db.schema
		.createTable("books")
		.addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
		.addColumn("title", "varchar(255)", (col) => col.notNull())
		.addColumn("author_id", "integer", (col) =>
			col.references("authors.id").onDelete("cascade").notNull(),
		)
		.addColumn("isbn", "varchar(13)", (col) => col.unique())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.addColumn("updated_at", "timestamp", (col) =>
			col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("users").execute();
	await db.schema.dropTable("books").execute();
	await db.schema.dropTable("authors").execute();
}
