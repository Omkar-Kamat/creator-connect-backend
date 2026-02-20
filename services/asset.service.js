import { Asset } from "../models/asset.model.js";
import { cloudinaryClient } from "../config/cloudinary.config.js";

export class AssetService {

  async createAsset(file, body, userId) {

    try {

      if (!file) {
        throw new Error("File is required");
      }

      if (!userId) {
        throw new Error("User ID is required");
      }

      const uploadResult = await new Promise((resolve, reject) => {

        this.getUploader().upload_stream(
          {
            resource_type: "auto",
            folder: "assets"
          },
          (error, result) => {

            if (error) reject(error);
            else resolve(result);

          }
        ).end(file.buffer);

      });

      const asset = await Asset.create({
        title: body.title,
        description: body.description,
        type: uploadResult.resource_type,
        url: uploadResult.secure_url,
        visibility: body.visibility || "public",
        owner: userId
      });

      return asset;

    } catch (error) {

      console.error("AssetService.createAsset Error:", error.message);
      throw error;

    }

  }

  async getPublicAssets(query) {

    try {

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 6;
      const skip = (page - 1) * limit;

      const search = query.search || "";

      const filter = {
        visibility: "public",
        title: { $regex: search, $options: "i" }
      };

      const assets = await Asset.find(filter)
        .populate("owner", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Asset.countDocuments(filter);

      return {
        assets,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {

      console.error("AssetService.getPublicAssets Error:", error.message);
      throw error;

    }

  }

  async getMyAssets(userId, query) {

    try {

      if (!userId) {
        throw new Error("User ID is required");
      }

      const page = parseInt(query.page) || 1;
      const limit = parseInt(query.limit) || 6;
      const skip = (page - 1) * limit;

      const assets = await Asset.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Asset.countDocuments({ owner: userId });

      return {
        assets,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };

    } catch (error) {

      console.error("AssetService.getMyAssets Error:", error.message);
      throw error;

    }

  }

  getUploader() {
    return cloudinaryClient.uploader;
  }

}

export const assetService = new AssetService();