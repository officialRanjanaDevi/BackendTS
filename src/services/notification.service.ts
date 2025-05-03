import Notification, { INotification } from "../models/notification.model";

export class NotificationService {
  async createNotification(notificationData: any) {
    try {
      const newNotification = await Notification.create(notificationData);
      return newNotification;
    } catch (error) {
      throw new Error("Error creating notification");
    }
  }

  async getNotifications(userId: string) {
    try {
      const notifications = await Notification.find({ userId }).exec();
      return notifications;
    } catch (error) {
      throw new Error("Error fetching notifications");
    }
  }

  async markNotificationAsRead(notificationId: string) {
    try {
      const notification = await Notification.findByIdAndUpdate(notificationId, { status: "read" }, { new: true }).exec();
      return notification;
    } catch (error) {
      throw new Error("Error marking notification as read");
    }
  }

  async deleteNotification(notificationId: string) {
    try {
      await Notification.findByIdAndDelete(notificationId).exec();
    } catch (error) {
      throw new Error("Error deleting notification");
    }
  }

  async updateNotification(notificationId: string, updatedData: any) {
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(notificationId, updatedData, { new: true }).exec();
      return updatedNotification;
    } catch (error) {
      throw new Error("Error updating notification");
    }
  }
}
