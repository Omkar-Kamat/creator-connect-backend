import mongoose from "mongoose";

export class ConversationModel {

  static schema = new mongoose.Schema(
    {
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        }
      ],

      lastMessage: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true
    }
  );

  static model = mongoose.model("Conversation", this.schema);

}

export const Conversation = ConversationModel.model;