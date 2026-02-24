import mongoose from "mongoose";

export class MessageModel {

  static schema = new mongoose.Schema(
    {
      conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
      },

      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },

      text: {
        type: String,
        required: true,
        trim: true
      },

      status: {
        type: String,
        enum: ["pending", "sent", "delivered","seen"],
        default: "pending"
      }
    },
    {
      timestamps: true
    }
  );

  static model =
    mongoose.models.Message ||
    mongoose.model("Message", this.schema);

}

export const Message = MessageModel.model;