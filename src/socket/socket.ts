import { Server } from "socket.io";
import LiveChat, { MessageModel } from "../models/liveChat.model";
import getConversation from "../middlewares/getChats";
import Store from "../models/store.model";

interface User {
  chatId: string;
  userId: string;
}

const onlineUsers = new Map<string, string>();
const liveStreams = new Map();

export function initializeSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("user connected:", socket.id);

    // Send current live streams to the newly connected client
    socket.emit("liveStreamStatus", Array.from(liveStreams.values()));

    io.emit("onlineUser", Array.from(onlineUsers.values()));
    // sidebar chat
    socket.on("sidebar", async (currentUserId) => {
      console.log("current user", currentUserId);

      const conversation = await getConversation(currentUserId);
      console.log(conversation)
      socket.emit("conversation", conversation);
    });

    // chat seen
    socket.on("seen", async ({ msgByUserId, currUser }) => {
      let conversation = await LiveChat.findOne({
        $or: [
          { sender: currUser, receiver: msgByUserId },
          { sender: msgByUserId, receiver: currUser }
        ]
      });
      // console.log(conversation, "conversation");
      const conversationMessageId = conversation?.messages || [];

      const updateMessages = await MessageModel.updateMany({ _id: { $in: conversationMessageId }, msgByUserId: currUser }, { $set: { seen: true } });
      console.log(updateMessages, "updateMessages");
      //send conversation
      const conversationSender = await getConversation(currUser);
      const conversationReceiver = await getConversation(msgByUserId);

      io.to(currUser).emit("conversation", conversationSender);
      io.to(msgByUserId).emit("conversation", conversationReceiver);
    });

    socket.on("joinChat", ({ chatId, userId }) => {
      socket.join(userId);
      onlineUsers.set(socket.id, userId);

      io.emit("onlineUser", Array.from(onlineUsers.values()));
      console.log(`User ${userId} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      console.log(data, "datufhgvhg");
      try {
        const chat = await LiveChat.findById(data?.chatId);
        if (!chat) {
          return;
        }
        const message = new MessageModel({
          text: data?.text,
          imageUrl: data?.imageUrl,
          videoUrl: data?.videoUrl,
          msgByUserId: data?.msgByUserId
        });

        const saveMessage = await message.save();
        const updateConversation = await LiveChat.updateOne(
          { _id: data?.chatId },
          {
            $push: { messages: saveMessage?._id }
          }
        );

        const getConversationMessage = await LiveChat.findOne({
          $or: [
            { sender: data?.sender, receiver: data?.receiver },
            { sender: data?.receiver, receiver: data?.sender }
          ]
        })
          .populate("messages")
          .sort({ updatedAt: -1 });

        io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
        io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

        //send conversation
        const conversationSender = await getConversation(data?.sender);
        const conversationReceiver = await getConversation(data?.receiver);
        console.log(conversationReceiver, conversationSender, "jh j j");
        io.to(data?.sender).emit("conversation", conversationSender);
        io.to(data?.receiver).emit("conversation", conversationReceiver);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("message-page", async ({ msgByUserId, currUser }) => {
      console.log("userId", msgByUserId);

      //get previous message
      const getConversationMessage = await LiveChat.findOne({
        $or: [
          { sender: currUser, receiver: msgByUserId },
          { sender: msgByUserId, receiver: currUser }
        ]
      })
        .populate("messages")
        .sort({ updatedAt: -1 });

      socket.emit("message", getConversationMessage?.messages || []);
    });

    // start live stream
    socket.on("startLiveStream", async ({ sellerId, roomId }) => {
      console.log(sellerId, roomId, "vghvgh");

      const store = await Store.findById(sellerId);
      if (!store) {
        console.log(`Store not found for seller ID: ${sellerId}`);
        return;
      }

      const liveStreamData = {
        sellerId,
        roomId,
        status: "started",
        storeName: store.storeName,
        storeLogo: store.images[0].url
      };

      liveStreams.set(roomId, liveStreamData);
      console.log(`Live stream started: ${roomId} by seller ${sellerId}`);
      io.emit("liveStreamStatus", Array.from(liveStreams.values()));
      console.log(liveStreams);
    });

    // end live stream
    socket.on("endLiveStream", ({ roomId }) => {
      if (liveStreams.has(roomId)) {
        liveStreams.delete(roomId);
        console.log(`Live stream ended: ${roomId}`);
        io.emit("liveStreamStatus", Array.from(liveStreams.values()));
      }
    });

    console.log(liveStreams);

    socket.on("disconnect", () => {
      const userId = onlineUsers.get(socket.id);
      if (userId) {
        onlineUsers.delete(socket.id);
        io.emit("onlineUser", Array.from(onlineUsers.values()));
        console.log("User disconnected:", socket.id);
        console.log("onlineUsers", onlineUsers);
      }
    });
  });
}
