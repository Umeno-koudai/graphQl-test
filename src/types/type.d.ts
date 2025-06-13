export type BookWithAuthor = Selectable<Books> & {
	author: string;
};

export type AddBookInput = {
	title: string;
	authorId: number;
	isbn: string;
};

export type UpdateBookInput = {
	id: number;
	title?: string;
	authorId?: number;
	isbn?: string;
};

export enum ReadStatus {
	UNREAD = "UNREAD",
	READING = "READING",
	READ = "READ",
}

export type BookWithStatusRow = Selectable<BookWithAuthor> & {
	status: ReadStatus;
};
