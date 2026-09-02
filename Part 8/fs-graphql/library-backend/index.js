const startServer = require("./server");

const PORT = process.env.PORT || 4000;

const main = async () => {
  startServer(PORT);
};

main();
