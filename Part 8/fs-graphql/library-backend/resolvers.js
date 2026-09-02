const { GraphQLError } = require("graphql");
const { v1: uuid } = require("uuid");

// In-memory data stores
let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert C. Martin",
    id: uuid(),
    genres: ["education", "programming"],
  },
  {
    title: "The Pragmatic Programmer",
    published: 1999,
    author: "Andrew Hunt",
    id: uuid(),
    genres: ["education", "programming"],
  },
];

let authors = [
  {
    name: "Robert C. Martin",
    id: uuid(),
    born: 1952,
  },
  {
    name: "Andrew Hunt",
    id: uuid(),
    born: 1964,
  },
];

let users = [
  {
    username: "demo",
    friends: [],
    id: uuid(),
  },
];

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: async (root, args) => {
      let filtered = [...books];

      if (args.author) {
        filtered = filtered.filter((book) => book.author === args.author);
      }

      if (args.genre) {
        filtered = filtered.filter((book) =>
          book.genres.includes(args.genre)
        );
      }

      return filtered;
    },
    allAuthors: () => authors,
    me: (root, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: (root) => books.filter((book) => book.author === root.name).length,
  },
  Mutation: {
    addBook: async (root, args) => {
      if (books.some((book) => book.title === args.title)) {
        throw new GraphQLError("Book already exists", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }

      // Check if author exists, if not create it
      let author = authors.find((a) => a.name === args.author);
      if (!author) {
        author = {
          name: args.author,
          id: uuid(),
          born: null,
        };
        authors.push(author);
      }

      const newBook = {
        title: args.title,
        published: args.published,
        author: args.author,
        id: uuid(),
        genres: args.genres,
      };

      books.push(newBook);
      return newBook;
    },
    editAuthor: async (root, args) => {
      const author = authors.find((a) => a.name === args.name);
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      return author;
    },
    createUser: async (root, args) => {
      const userExists = users.some((u) => u.username === args.username);
      if (userExists) {
        throw new GraphQLError("User already exists", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
          },
        });
      }

      const newUser = {
        username: args.username,
        friends: [],
        id: uuid(),
      };

      users.push(newUser);
      return newUser;
    },
    login: async (root, args) => {
      const user = users.find((u) => u.username === args.username);
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user.id,
      };

      // Simple JWT-like token generation (in production use jwt library)
      const token = Buffer.from(JSON.stringify(userForToken)).toString(
        "base64"
      );
      return { value: token };
    },
  },
};

module.exports = resolvers;
