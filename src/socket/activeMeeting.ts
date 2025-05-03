// let activeMeetings = [];
// import { MeetingService } from "../services/meeting.service";

// export const addNewActiveMeeting = async (socketId, data) => {
//   const result = await new MeetingService().startMeeting(data);
//   activeMeetings = [...activeMeetings, { ...result.data, createrSocketId: socketId }];

//   return result;
// };

// export const getActiveMeetings = () => {
//   return [...activeMeetings];
// };

// export const getActiveMeeting = (meetingId) => {
//   const meeting = activeMeetings.find((meeting) => meeting._id === meetingId);

//   if (meeting) {
//     return meeting;
//   } else {
//     return {
//       message: "No Meeting Found"
//     };
//   }
// };

// export const joinActiveMeeting = async (meetingId, liveDemoId, socketId) => {
//   const result = await new MeetingService().joinMeeting(meetingId, liveDemoId);

//   const meeting = activeMeetings.find((meeting) => meeting._id === meetingId);
//   if (meeting) {
//     activeMeetings = activeMeetings.filter((meeting) => meeting._id !== meetingId);
//     const updatedMeeting = { ...meeting, liveDemos: [...meeting.liveDemos, { liveDemoId, socketId: socketId }] };

//     activeMeetings.push(updatedMeeting);

//     return { success: true, message: "Meeting joined", data: updatedMeeting };
//   }

//   return { success: false, message: "Meeting doesnt exist or has been ended" };
// };

// export const leaveActiveMeeting = async (meetingId, liveDemoId, socketId) => {
//   const result = await new MeetingService().leaveMeeting(meetingId, liveDemoId);

//   const meeting = activeMeetings.find((meeting) => meeting._id === meetingId);
//   if (meeting) {
//     activeMeetings = activeMeetings.filter((meeting) => meeting._id !== meetingId);
//     const updatedMeeting = { ...meeting, liveDemos: meeting.liveDemos.filter((liveDemo) => liveDemo.socketId !== socketId) };

//     activeMeetings.push(updatedMeeting);
//     return { success: true, message: "Meeting left", data: updatedMeeting };
//   }
//   return { success: false, message: "Meeting doesnt exist or has been ended" };
// };
