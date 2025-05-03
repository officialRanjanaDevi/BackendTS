import { Schema, model, Document } from "mongoose";

export interface INotification extends Document {
  userId: string;
  message: string;
  status: string;
  sendAt: Date;
}

const notificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ["read", "unread"], default: "unread" },
  sendAt: { type: Date, default: Date.now }
});

const Notification = model<INotification>("Notification", notificationSchema);

export default Notification;
