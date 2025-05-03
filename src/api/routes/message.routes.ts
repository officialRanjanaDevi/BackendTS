import { Router } from "express";
import { LiveChatController } from "../../socket/controllers/liveChat.controller";

export class MessageRoutes {
  static register(io: any) {
    const router = Router();

    router.post("/api/v1/createMessage", (req, res, next) => LiveChatController.createMessage(req, res, next, io));
    router.get("/api/v1/getChat/:storeId/:userId", LiveChatController.getChat);
    router.post("/api/v1/schedule", LiveChatController.scheduleVideo);
    router.get("/api/v1/meetings/:id", LiveChatController.getAllMeetings);
    router.get("/api/v1/meeting/:id", LiveChatController.getMeeting);

    return router;
  }
}
