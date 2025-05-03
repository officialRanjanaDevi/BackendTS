// import { Server } from "socket.io";
// import { setServerSocketInstance } from "./connectedUsers";
// import { MeetingsController } from "./controllers/meetings.controller";
// // import { MessagesController } from "./controllers/messages.controller";

// import { disconnectHandler } from "./connectedUsers";
// export const createSocketServer = (server) => {
//   const io = new Server(server, {
//     cors: {
//       origin: ["*"],
//       methods: ["GET", "POST"]
//     }
//   });

//   setServerSocketInstance(io);

//   io.on("connection", (socket) => {
//     console.log(`New socket connection connected: ${socket.id}`);

//     // * Meeting related events
//     socket.on("start-meeting", (data) => {
//       MeetingsController.startMeeting(socket, data);
//     });

//     socket.on("join-meeting", (data) => {
//       MeetingsController.joinMeeting(socket, data);
//     });

//     socket.on("leave-meeting", (data) => {
//       MeetingsController.leaveMeeting(socket, data);
//     });

//     socket.on("end-meeting", (data) => {
//       MeetingsController.endMeeting(socket, data);
//     });

//     // Messaging related events
//     socket.on("send-message", (data) => {
//       MessagesController.sendMessage(socket, data);
//     });

//     socket.on("get-messages", (data) => {
//       MessagesController.getMessages(socket, data);
//     });

//     socket.on("disconnect", () => {
//       console.log(`Connected socket disconnected: ${socket.id}`);
//       disconnectHandler(socket, io);
//   });
//   });
// };
