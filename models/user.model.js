import mongoose from "mongoose";

export class UserModel {

  static schema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true
      },
      role: {
        type: String,
        default: "user"
      },
      tokens: {
        type: Number,
        default: 5
      }
    },
    {
      timestamps: true
    }
  );

  static model = mongoose.model("User", UserModel.schema);

}

export const User = UserModel.model;