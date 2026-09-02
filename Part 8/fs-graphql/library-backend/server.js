const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const jwt = require("jsonwebtoken");

const resolvers = require("./resolvers");
const typeDefs = require("./schema");
const User = require("./models/user");

const getUserFromToken = async (auth) => {
  if (!auth || !auth.startsWith("Bearer ")) {
    return null;
  }
  try {
    const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET);
    return await User.findById(decodedToken.id);
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
      const currentUser = await getUserFromToken(auth);
      return { currentUser };
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

module.exports = startServer;
