const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");

// In-memory users array (same as in resolvers.js in production, this would be shared)
const users = [
  {
    username: "demo",
    friends: [],
    id: "1",
  },
];

const getUserFromToken = (auth) => {
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  try {
    const token = auth.substring(7);
    const decodedToken = JSON.parse(Buffer.from(token, "base64").toString());
    return users.find((u) => u.id === decodedToken.id);
  } catch (error) {
    return null;
  }
};

const startServer = async (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization;
      const currentUser = getUserFromToken(auth);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
