import { createPool } from "mysql2";
import { Kysely, MysqlDialect, CamelCasePlugin } from "kysely";
import { DB } from "kysely-codegen";
import * as dotenv from "dotenv";

dotenv.config();

const dialect = new MysqlDialect({
	pool: createPool({
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
		connectionLimit: 10,
	}),
});

export const db = new Kysely<DB>({
	dialect,
	plugins: [new CamelCasePlugin()],
});
