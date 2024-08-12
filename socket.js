let io;
module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST", "DELETE"],
      },
    });
    return io;
  },
  getIo: () => {
    if (!io) {
      throw Error("Socket.io is not initialized");
    }
    return io;
  },
};
