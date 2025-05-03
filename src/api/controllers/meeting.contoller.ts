// import { Request, Response, NextFunction } from "express";
// import { MeetingService } from "../../services/meeting.service";
// export class MeetingController {
//   static async startMeeting(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const { data } = request.body;

//     const result = await new MeetingService().startMeeting(data);

//     if (result.success) {
//       response.status(201).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }

//   static async endMeeting(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const { meetingId } = request.params;

//     const result = await new MeetingService().endMeeting(meetingId);

//     if (result.success) {
//       response.status(200).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }

//   static async getOneMeeting(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const { meetingId } = request.params;

//     const result = await new MeetingService().getOneMeeting(meetingId);

//     if (result.success) {
//       response.status(200).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }

//   static async getStoreMeetings(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const { storeId } = request.params;
//     const result = await new MeetingService().getStoreMeetings(storeId);

//     if (result.success) {
//       response.status(200).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }

//   static async getAllMeetings(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const result = await new MeetingService().getAllMeetings();

//     if (result.success) {
//       response.status(200).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }

//   static async deleteMeeting(request: Request, response: Response, next: NextFunction): Promise<void> {
//     const { meetingId } = request.params;

//     const result = await new MeetingService().deleteMeeting(meetingId);

//     if (result.success) {
//       response.status(200).json(result);
//     } else {
//       response.status(500).json(result);
//     }
//   }
// }
