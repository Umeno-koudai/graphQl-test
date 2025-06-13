import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { GraphQLScalarType, Kind } from "graphql";
import { AddBookInput, UpdateBookInput } from "./types/type";
import { createBook, findAllBooks, updateBook, findBookById, findBookByAuthorId, deleteBook } from "./repository/book";

const schema = loadSchemaSync("./schema.graphql", {
	loaders: [new GraphQLFileLoader()],
});

const DateScalar = new GraphQLScalarType({
	name: "Date",
	description: "ISO 8601 date string",
	serialize: (value) => (value as Date).toISOString().split("T")[0],
	parseValue: (value) => new Date(value as string),
	parseLiteral: (ast) =>
		ast.kind === Kind.STRING ? new Date(ast.value) : null,
});

const DateTimeScalar = new GraphQLScalarType({
	name: "DateTime",
	description: "ISO 8601 date-time string",
	serialize: (value) => (value as Date).toISOString(),
	parseValue: (value) => new Date(value as string),
	parseLiteral: (ast) =>
		ast.kind === Kind.STRING ? new Date(ast.value) : null,
});

const resolvers = {
	Date: DateScalar,
	DateTime: DateTimeScalar,

	Query: {
		books: () => findAllBooks(),

    book: async (_: any, { id }: { id: string }) => {
      return findBookById(Number(id));
    },

    bookByAuthor: async (_: any, { authorId }: { authorId: string }) => {
      return findBookByAuthorId(Number(authorId));
    }
	},

	Mutation: {
		addBook: async (_: any, { input }: { input: AddBookInput }) => {
			if (!input) throw Error("inputが存在しません");
			return { status: await createBook(input) };
		},
    updateBook: async (_: any, { input }: { input: UpdateBookInput }) =>{
      if(!input) throw Error("inputかidが設定されていません");
      return { status: await updateBook(input) };
    },
    deleteBook: async (_: any, { id }: { id: string}) => {
      if(!id) throw Error("idがありません");
      return { status: await deleteBook(Number(id)) };
    }
	},
};

async function main() {
	const schemaWithResolvers = addResolversToSchema({ schema, resolvers });
	const server = new ApolloServer({ schema: schemaWithResolvers });
	const { url } = await startStandaloneServer(server, {
		listen: { port: 4000 },
	});
	console.log(`🚀 Server ready at ${url}`);
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
