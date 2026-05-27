import http from "http";
import express from "express";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "#middleware/socket.middleware.js";
import bookingService from "#modules/bookings/booking.service.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

io.use(socketAuthMiddleware);

const onlineUser = new Map();

io.on("connection", async (socket) => {
  const user = socket.user;
  console.log(`${user.id} online với socket id ${socket.id}`);

  onlineUser.set(user.id,socket.id);
  io.emit("online-users", Array.from(onlineUser));

  const bookingIds = await bookingService.getBookingIdForSocketId(user.id);
  bookingIds.forEach((id)=> {
    socket.join(id)
  });
  socket.join(user.id);
  socket.on('disconnect', () => {
    console.log(`${user.id} offline`);
    onlineUser.delete(user.id);
    io.emit("online-users", Array.from(onlineUser));
  })
});

export {server, io, app};