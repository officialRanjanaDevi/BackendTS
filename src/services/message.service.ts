// import { Error } from "mongoose";
// import Meeting from "../models/meeting.model";
// import { Message } from "../models/message.model";
// import { MessageDocument } from "../models/message.model";
// import { IMeeting } from "./../models/meeting.model";
// import { Schema } from "mongoose";

// export class MessageService {
//   async sendMessage(meetingId: string, data: MessageDocument): Promise<{ success: boolean; message: string; data?: { messageData: MessageDocument; meetingData: IMeeting }; error?: Error }> {
//     try {
//       const message = new Message(data);

//       const result = await Meeting.findByIdAndUpdate(meetingId, { $push: { messages: message._id } }, { new: true }).exec();

//       return {
//         success: true,
//         message: "Message sent successfully",
//         data: { messageData: message, meetingData: result }
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while sending message",
//         error: err
//       };
//     }
//   }

//   async getMessages(meetingId: string): Promise<{ success: boolean; message: string; data?: Schema.Types.ObjectId[]; error?: Error }> {
//     try {
//       const result = await Meeting.findById(meetingId).populate("messages").exec();
//       const messages = result?.messages;
//       return {
//         success: true,
//         message: "Message retrieved successfully",
//         data: messages
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while retrieving message",
//         error: err
//       };
//     }
//   }
// }
