import { cloudinaryClient } from "../config/cloudinary.config.js";

export class CloudinaryUploadService {

  constructor() {
    this.cloudinary = cloudinaryClient;
  }

  async uploadToCloudinary(filePath, resourceType) {

    try {

      if (!filePath) {
        throw new Error("File path is required");
      }

      if (!resourceType) {
        throw new Error("Resource type is required");
      }

      const result = await this.cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        folder: "assets"
      });

      return {
        url: result.secure_url,
        public_id: result.public_id
      };

    } catch (error) {

      console.error("CloudinaryUploadService.uploadToCloudinary Error:", error.message);
      throw error;

    }

  }

}

export const cloudinaryUploadService = new CloudinaryUploadService();