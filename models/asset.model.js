import mongoose from "mongoose";

export class AssetModel {

  static schema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: true
      },
      description: {
        type: String
      },
      type: {
        type: String,
        enum: ["image", "video"],
        required: true
      },
      url: {
        type: String,
        required: true
      },
      visibility: {
        type: String,
        enum: ["public", "private"],
        default: "public"
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    },
    {
      timestamps: true
    }
  );

  static model = mongoose.model("Asset", AssetModel.schema);

}

export const Asset = AssetModel.model;