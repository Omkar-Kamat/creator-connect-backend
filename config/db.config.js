import mongoose from "mongoose";

export class Database {

  constructor() {
    this.isConnected = false;
  }

  async connect() {

    try {

      if (this.isConnected) {
        return;
      }

      const conn = await mongoose.connect(process.env.MONGO_URI, {
        autoIndex: true
      });

      this.isConnected = true;

      console.log(`MongoDB Connected: ${conn.connection.host}`);

    } catch (error) {

      console.error("MongoDB connection failed:", error.message);
      process.exit(1);

    }

  }

}

export const database = new Database();