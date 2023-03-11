import { Message } from "../models/Message.js";

class MessageManager {
  async addMessage({ user, message }) {
    try {
      const newMessage = new Message({
        user,
        message,
      });
      await newMessage.save();
      return true;
    } catch (err) {
      return false;
    }
  }

  async getMessages() {
    try {
      const messages = await Message.find().lean();
      if (!messages) return [];
      return messages;
    } catch (err) {
      return err.message;
    }
  }
}

export default MessageManager;
