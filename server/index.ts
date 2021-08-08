import { getUsersFromRoom } from "./../utils/getUsersFromRoom";
import { UserData } from "./../pages/index";
import express from "express";
import dotenv from "dotenv";
import sharp from "sharp";
import fs from "fs";
import socket from "socket.io";
import { createServer } from "http";
import cors from "cors";
import "./core/db";
import { passport } from "./core/passport";
import { uploader } from "./core/uploader";

import AuthController from "./controllers/AuthController";
import RoomController from "./controllers/RoomController";
import { Room } from "../models";
import { SocketRoom } from "../utils/getUsersFromRoom";

dotenv.config({
  path: "./server/.env",
});

const app = express();
const server = createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json);
app.use(passport.initialize());

app.get(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.index
);
app.post(
  "/rooms",
  passport.authenticate("jwt", { session: false }),
  RoomController.create
);
app.get(
  "/rooms/:id(/d+$/)",
  passport.authenticate("jwt", { session: false }),
  RoomController.show
);
app.delete(
  "/rooms/:id",
  passport.authenticate("jwt", { session: false }),
  RoomController.delete
);

app.get(
  "/auth/me",
  passport.authenticate("jwt", { session: false }),
  AuthController.getMe
);
app.get(
  "/auth/sms",
  passport.authenticate("jwt", { session: false }),
  AuthController.sentSms
);
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
app.post(
  "/auth/sms/activate",
  passport.authenticate("jwt", { session: false }),
  AuthController.activate
);
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  AuthController.authCallback
);
app.post("/upload", uploader.single("photo"), (req, res) => {
  const filePath = req.file.path;
  sharp(filePath)
    .resize(150, 150)
    .toFormat("jpeg")
    .toFile(filePath.replace(".png", ".jpeg"), (err) => {
      if (err) {
        throw err;
      }
      fs.unlinkSync(filePath);

      res.json({
        url: `/avatars/${req.file.filename.replace(".png", "jpeg")}`,
      });
    });
});

export const rooms: SocketRoom = {};

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("CLIENT@ROOMS:JOIN", ({ user, roomId }) => {
    socket.join(`room/${roomId}`);
    rooms[socket.id] = { roomId, user };
    const users = getUsersFromRoom(rooms, roomId);
    io.in(`room/${roomId}`).emit("SERVER@ROOMS:JOIN", users)
    io.emit("SERVER@ROOMS:HOME", users)
    Room.update({ speakers: users }, { where: { id: roomId } })
  });
  socket.on("disconnect", () => {
    if (rooms[socket.id]) {
      const { roomId, user } = rooms[socket.id];
      socket.broadcast
        .to(`room/${roomId}`)
        .broadcast.emit("SERVER@ROOMS:LEAVE", user);
      delete rooms[socket.id];
      const users = getUsersFromRoom(rooms, roomId);
      Room.update({ speakers: users }, { where: { id: roomId } });
    }
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNED");
});
