import { NextFunction, Request, Response } from "express";
import { NotificationService } from "../../services/notification.service";

export class NotificationController {
  static async createNotification(request: Request, response: Response, next: NextFunction): Promise<void> {
    const notificationData = request.body;
    const notificationService = new NotificationService();
    try {
      const newNotification = await notificationService.createNotification(notificationData);
      response.json(newNotification);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getNotifications(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { userId } = request.params;
    const notificationService = new NotificationService();
    try {
      const notifications = await notificationService.getNotifications(userId);
      response.json(notifications);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async markNotificationAsRead(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const notificationService = new NotificationService();
    try {
      const updatedNotification = await notificationService.markNotificationAsRead(id);
      response.json(updatedNotification);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteNotification(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const notificationService = new NotificationService();
    try {
      await notificationService.deleteNotification(id);
      response.json({ message: "Notification deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateNotification(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const updatedData = request.body;
    console.log("Updating notification with ID:", id);
    console.log("Updated data:", updatedData);

    const notificationService = new NotificationService();
    try {
      const updatedNotification = await notificationService.updateNotification(id, updatedData);
      console.log("Updated notification:", updatedNotification);
      response.json(updatedNotification);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
