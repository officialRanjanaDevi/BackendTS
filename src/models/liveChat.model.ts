import mongoose, { Schema, Document } from "mongoose";

interface IMessage {
  msgByUserId: mongoose.Schema.Types.ObjectId;
  text: string;
  imageUrl: string;
  videoUrl: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ILiveChat extends Document {
  sender: string;
  receiver: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    text: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const LiveChatSchema: Schema = new Schema(
  {
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    messages: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const MessageModel = mongoose.model<IMessage>("Message", MessageSchema);
const LiveChat = mongoose.model<ILiveChat>("LiveChat", LiveChatSchema);

export default LiveChat;
