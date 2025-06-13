import { db } from "../database/db";
import { sql } from "kysely";
import {
	BookWithAuthor,
	AddBookInput,
	UpdateBookInput,
	BookWithStatusRow,
} from "../types/type";
import { Console } from "console";
import { title } from "process";

// 書籍と著者を結合したクエリ
const bookWithAuthorQuery = db
	.selectFrom("books")
	.innerJoin("authors", "authors.id", "books.author_id")
	.selectAll("books")
	.select("authors.name as author");

/**
 * 全書籍情報と著者情報を取得
 * @returns 全書籍情報と著者情報を取得
 */
export const findAllBooks = async (): Promise<BookWithAuthor[]> => {
	return await bookWithAuthorQuery.execute();
};

export const findBookById = async (id: number): Promise<BookWithAuthor> => {
    return await bookWithAuthorQuery.where("books.id", "=", id).executeTakeFirst();
}

export const findBookByAuthorId = async (id: number): Promise<BookWithAuthor> => {
    return await bookWithAuthorQuery.where("books.author_id", "=", id).executeTakeFirst();
}

/**
 * 書籍追加
 * @param input 書籍追加用の入力データ
 * @returns 成功したら true を返す
 */
export const createBook = async (input: AddBookInput): Promise<boolean> => {
    try{
        const result = db
        .insertInto("books")
        .columns(["title", "author_id", "isbn"])
        .values({
            title: input.title, 
            author_id: input.authorId, 
            isbn: input.isbn,
        })
        .execute();
        return true
    }
    catch(err){
        console.error(err);
        return false;
    }
};

export const updateBook = async (input: UpdateBookInput, selectId:string): Promise<boolean> => {
    try{
        const result = await db
        .updateTable("books")
        .set({
            ...(input.title !== undefined && {title: input.title}), 
            ...(input.authorId !== undefined && {author_id: input.authorId}), 
            ...(input.isbn !== undefined && {isbn: input.isbn})
        })
        .where("id", '=', input.id)
        .executeTakeFirst();
        return true;
    }
    catch(erro){
        console.error(erro);
        return false;
    }
}
