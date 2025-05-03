import { NextFunction, Request, Response } from "express";
import { ChatService } from "../../services/chat.service";

export class ChatController {
  static async createChat(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { participants, messages } = request.body;
    const chatService = new ChatService();
    try {
      const newChat = await chatService.createChat(participants, messages);
      response.json(newChat);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getChatById(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const chatService = new ChatService();
    try {
      const chat = await chatService.getChatById(id);
      response.json(chat);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateChat(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const updatedData = request.body;
    const chatService = new ChatService();
    try {
      const updatedChat = await chatService.updateChat(id, updatedData);
      response.json(updatedChat);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteChat(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const chatService = new ChatService();
    try {
      await chatService.deleteChat(id);
      response.json({ message: "Chat deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
