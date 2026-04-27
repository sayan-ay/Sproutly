require("dotenv").config();

const { createServer } = require("http");
const { Server } = require("socket.io");

const cookieParser = require("cookie-parser");

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

const app = express();

const httpServer = createServer(app);

const dbConnect = require("./config/dbconnect");
dbConnect();

const { init } = require("./config/socket");

const bookmarksRoutes=require("./Routes/bookmarks");
const reactionRoutes = require("./Routes/reactions");
const searchRoutes = require("./Routes/search");
const commentRoutes = require("./Routes/comments");
const postRoutes = require("./Routes/posts");
const userRoutes = require("./Routes/users");
const authMeRoutes = require("./Routes/authMe");
const uploadRoutes = require("./Routes/upload");

// app.use(express.static("Public"));
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use("/comments", commentRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);
app.use("/auth/me", authMeRoutes);
app.use("/images", uploadRoutes);
app.use("/search", searchRoutes);
app.use("/reactions", reactionRoutes);
app.use("/bookmarks",bookmarksRoutes);

mongoose.connection.once("open", () => {
  httpServer.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
    init(
      new Server(httpServer, {
        cors: {
          origin: process.env.FRONTEND_URL,
          credentials: true,
        },
      }),
    );
  });
});
