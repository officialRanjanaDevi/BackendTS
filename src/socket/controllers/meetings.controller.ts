// import { MeetingService } from "../../services/meeting.service";
// import { Socket } from "socket.io";
// import { addNewActiveMeeting, joinActiveMeeting, leaveActiveMeeting } from "../activeMeeting";
// export class MeetingsController {
//   static async startMeeting(socket: Socket, data: any): Promise<void> {
//     const socketId = socket.id;
//     const result = await addNewActiveMeeting(socketId, data);

//     socket.emit("start-meeting", { result });
//   }

//   static async joinMeeting(socket: Socket, data: any): Promise<void> {
//     const { meetingId, liveDemoId } = data;
//     const socketId = socket.id;
//     const result = await joinActiveMeeting(meetingId, liveDemoId, socketId);

//     if (result.success) {
//       result.data.liveDemos.forEach((liveDemo) => {
//         if (liveDemo.socketId !== socketId) {
//           socket.to(liveDemo.socketId).emit("connection-prepare", {
//             connectionSocketId: socketId
//           });
//         }
//       });
//     } else {
//       socket.emit("join-meeting", { result });
//     }
//   }

//   static async leaveMeeting(socket: Socket, data: any): Promise<void> {
//     const { meetingId, liveDemoId } = data;
//     const socketId = socket.id;
//     const result = await leaveActiveMeeting(meetingId, liveDemoId, socketId);

//     if (result.success) {
//       result.data.liveDemos.forEach((liveDemo) => {
//         if (liveDemo.socketId !== socketId) {
//           socket.to(liveDemo.socketId).emit("meeting-livedemo-left", {
//             connectionSocketId: socketId
//           });
//         }
//       });
//     } else {
//       socket.emit("leave-meeting", { result });
//     }
//   }

//   static async endMeeting(socket: Socket, data: any): Promise<void> {
//     const { meetingId } = data;
//     const result = await new MeetingService().endMeeting(meetingId);

//     socket.emit("end-meeting", { result });
//   }
// }
