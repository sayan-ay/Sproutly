const jwt = require("jsonwebtoken");
const cookie = require("cookie");

let io; //server socket

exports.init = (ioFromIndexJs) => {
  io = ioFromIndexJs;

  io.use((socketFromClient, next) => {
    const token = cookie.parse(
      socketFromClient.handshake.headers.cookie,
    ).accessToken;
    if (!token) return next(new Error("Unauthorised"));

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socketFromClient.userId = decoded._id.toString();

    next();
  });

  io.on("connection", (socketFromClient) => {
    console.log(`${socketFromClient.id} have connected`);
    const userId = socketFromClient.userId;
    socketFromClient.join(userId);
    socketFromClient.on("disconnect", () =>
      console.log(`${socketFromClient.id} have disconnected`),
    );
  });
};

exports.emitToOneUser = (room, event, data) => {
  io.to(room.toString()).emit(event, data);
};
