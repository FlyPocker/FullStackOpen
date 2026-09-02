const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: async () => {
      return Book.collection.countDocuments();
    },
    authorCount: async () => {
      return Author.collection.countDocuments();
    },
    allBooks: async (root, args) => {
      const filters = {};

      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        if (author) {
          filters.author = author._id;
        } else {
          return [];
        }
      }

      if (args.genre) {
        filters.genres = { $in: [args.genre] };
      }

      return Book.find(filters);
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: async (root) => {
      return Author.findById(root.author);
    },
  },
  Author: {
    bookCount: async (root) => {
      return Book.countDocuments({ author: root._id });
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      if (args.title.length < 3) {
        throw new GraphQLError("title must be at least 3 characters", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: "title",
          },
        });
      }

      if (args.author.length < 3) {
        throw new GraphQLError("author name must be at least 3 characters", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: "author",
          },
        });
      }

      const bookExists = await Book.findOne({ title: args.title });
      if (bookExists) {
        throw new GraphQLError("Book already exists", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }

      // Check if author exists, if not create it
      let author = await Author.findOne({ name: args.author });
      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError("Error creating author", {
            extensions: {
              code: "INTERNAL_SERVER_ERROR",
              invalidArgs: args.author,
              error: error.message,
            },
          });
        }
      }

      const book = new Book({
        title: args.title,
        published: args.published,
        author: author._id,
        genres: args.genres,
      });
      try {
        await book.save();
        await book.populate("author");
      } catch (error) {
        throw new GraphQLError("Error saving book", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args.title,
            error: error.message,
          },
        });
      }
      return book;
    },
    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;
      try {
        await author.save();
      } catch (error) {
        throw new GraphQLError("Error updating author", {
          extensions: {
            code: "INTERNAL_SERVER_ERROR",
            invalidArgs: args.name,
            error: error.message,
          },
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error: error.message,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError(
          "Database reset is only allowed in test environment",
        );
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },
};

module.exports = resolvers;
