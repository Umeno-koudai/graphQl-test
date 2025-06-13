import { title } from "process";
import { db } from "../db";

const users = [
	{
		name: "田中 太郎 (管理者)",
		email: "admin@example.com",
		password_hash: "admin_password",
		role: "admin",
	},
	{
		name: "鈴木 一郎",
		email: "user@example.com",
		password_hash: "user_password",
		role: "user",
	},
];

const authors = [
	{ name: "夏目 漱石" },
	{ name: "芥川 龍之介" },
	{ name: "太宰 治" },
	{ name: "宮沢 賢治" },
];

const books = [
	{ title: "こころ", author_id: 1, isbn: "9784101010037" },
	{ title: "吾輩は猫である", author_id: 1, isbn: "9784101010013" },
	{ title: "坊ちゃん", author_id: 1, isbn: "9784101010020" },
	{ title: "羅生門・鼻", author_id: 2, isbn: "9784101020012" },
	{ title: "人間失格", author_id: 3, isbn: "9784101006022" },
	{ title: "銀河鉄道の夜", author_id: 4, isbn: "9784101092057" },
	{ title: "注文の多い料理店", author_id: 4, isbn: "9784101092064" },
];

const leadList = [
	{ user_id: 1, book_id: 1, status: "UNREAD" },
	{ user_id: 1, book_id: 2, status: "UNREAD" },
	{ user_id: 2, book_id: 3, status: "UNREAD" },
	{ user_id: 2, book_id: 4, status: "READ" },
	{ user_id: 1, book_id: 5, status: "READING" },
	{ user_id: 2, book_id: 6, status: "READ" },
];

const seed = async () => {
	console.log("🌱 Seeding started...");

	await db.deleteFrom("books").execute();
	await db.deleteFrom("users").execute();
	await db.deleteFrom("authors").execute();
	console.log("🗑️  Existing data deleted.");

	await db.insertInto("users").values(users).execute();
	console.log("👥 Users seeded.");

	await db.insertInto("authors").values(authors).execute();
	console.log("👤 Authors seeded.");

	await db.insertInto("books").values(books).execute();
	console.log("📚 Books seeded.");

	await db.insertInto("read_list").values(leadList).execute();
	console.log("📖 Read list seeded.");
};

seed()
	.then(() => {
		console.log("✅ Seeding completed successfully.");
	})
	.catch((err) => {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await db.destroy();
	});
