// import { Error } from "mongoose";
// import Meeting from "../models/meeting.model";
// import { IMeeting } from "../models/meeting.model";

// export class MeetingService {
//   async startMeeting(data: IMeeting): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const meeting = new Meeting(data);
//       await meeting.save();

//       return {
//         success: true,
//         message: "Meeting started successfully",
//         data: meeting
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while starting meeting",
//         error: err
//       };
//     }
//   }

//   async joinMeeting(meetingId: string, liveDemoId: string): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const res = await Meeting.findByIdAndUpdate(meetingId, { $push: { liveDemos: liveDemoId } }, {new: true}).exec();

//       return {
//         success: true,
//         message: "Meeting joined successfully",
//         data: res
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while joining meeting",
//         error: err
//       };
//     }
//   }
//   async leaveMeeting(meetingId: string, liveDemoId: string): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const res = await Meeting.findByIdAndUpdate(meetingId, { $pull: { liveDemos: liveDemoId } }).exec();

//       return {
//         success: true,
//         message: "Meeting left successfully",
//         data: res
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while leaving meeting",
//         error: err
//       };
//     }
//   }

//   async endMeeting(meetingId: string): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const result = await Meeting.findByIdAndUpdate(meetingId, { endTime: Date.now() }).exec();

//       return {
//         success: true,
//         message: "Meeting ended successfully",
//         data: result
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while ending meeting",
//         error: err
//       };
//     }
//   }

//   async getOneMeeting(meetingId: string): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const result = await Meeting.findOne({ _id: meetingId }).exec();

//       return {
//         success: true,
//         message: "Meeting found successfully",
//         data: result
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while getting meeting details",
//         error: err
//       };
//     }
//   }

//   async getStoreMeetings(storeId: string): Promise<{ success: boolean; message: string; data?: IMeeting[]; error?: Error }> {
//     try {
//       const meetings = await Meeting.find({ storeId: storeId }).exec();

//       return {
//         success: true,
//         message: "Meetings found successfully",
//         data: meetings
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while getting meetings",
//         error: err
//       };
//     }
//   }

//   async getAllMeetings(): Promise<{ success: boolean; message: string; data?: IMeeting[]; error?: Error }> {
//     try {
//       const meetings = await Meeting.find({}).exec();

//       return {
//         success: true,
//         message: "Meetings found successfully",
//         data: meetings
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while getting meetings",
//         error: err
//       };
//     }
//   }

//   async deleteMeeting(meetingId: string): Promise<{ success: boolean; message: string; data?: IMeeting; error?: Error }> {
//     try {
//       const result = await Meeting.findByIdAndDelete(meetingId).exec();

//       return {
//         success: true,
//         message: "Meeting deleted successfully",
//         data: result
//       };
//     } catch (err) {
//       console.log(err);
//       return {
//         success: false,
//         message: "Error while deleting meeting",
//         error: err
//       };
//     }
//   }
// }
