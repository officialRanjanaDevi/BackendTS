import { Request, Response, NextFunction } from "express";
import LiveChat, { MessageModel } from "../../models/liveChat.model";
import Appointment from "../../models/meetRequest.model";
import Meeting from "../../models/meeting.model";
import mongoose from "mongoose";
export class LiveChatController {
  static async getChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { storeId, userId } = req.params;
    try {
      const chat = await LiveChat.findOne({
        receiver: storeId,
        sender: userId
      }).populate("messages");
      if (chat) {
        res.json(chat);
      } else {
        res.json({ messages: [] });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async createMessage(req: Request, res: Response, next: NextFunction, io: any): Promise<void> {
    const { storeId, userId, sender, content } = req.body;
    try {
      let chat = await LiveChat.findOne({ storeId, userId });
      if (!chat) {
        chat = new LiveChat({ receiver: storeId, sender: userId, messages: [] });
      }

      if (io) {
        io.to(chat._id.toString()).emit("receiveMessage", content);
      }

      await chat.save();
      res.status(201).json(chat);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async scheduleVideo(req: Request, res: Response): Promise<void> {
    try {
      const appointment = new Appointment(req.body);
      await appointment.save();
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Error scheduling appointment" });
    }
  }

  static async getAllMeetings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const meetings = await Appointment.find({ userId: id }).populate("products")

      const meeti = await Meeting.find().populate("products");

      const objectId = new mongoose.Types.ObjectId(id);

      const liveMeetings = meeti.filter(meeting =>
        meeting.users.some(userId => userId.equals(objectId))
      );

      res.json({ meetings,liveMeetings,meeti });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async getMeeting(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const meeting = await Meeting.findById(id)
      res.json(meeting);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
