import { v2 as cloudinary } from "cloudinary";

export class CloudinaryService {

  constructor() {

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    this.cloudinary = cloudinary;

  }

  getClient() {
    return this.cloudinary;
  }

}

export const cloudinaryService = new CloudinaryService();
export const cloudinaryClient = cloudinaryService.getClient();