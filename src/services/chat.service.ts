import Chat, { IChat, IMessage } from "../models/chat.model";

export class ChatService {
  async createChat(participants: string[], messages: IMessage[]) {
    try {
      const newChat = await Chat.create({ participants, messages });
      return newChat;
    } catch (error) {
      throw new Error("Error creating chat");
    }
  }

  async getChatById(chatId: string) {
    try {
      const chat = await Chat.findById(chatId).exec();
      return chat;
    } catch (error) {
      throw new Error("Error fetching chat");
    }
  }

  async updateChat(chatId: string, updatedData: Partial<IChat>) {
    try {
      const updatedChat = await Chat.findByIdAndUpdate(chatId, updatedData, { new: true }).exec();
      return updatedChat;
    } catch (error) {
      throw new Error("Error updating chat");
    }
  }

  async deleteChat(chatId: string) {
    try {
      await Chat.findByIdAndDelete(chatId).exec();
    } catch (error) {
      throw new Error("Error deleting chat");
    }
  }
}
