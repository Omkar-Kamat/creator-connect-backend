import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export class AuthService {

  async registerUser({ name, email, password }) {

    try {

      if (!name || !email || !password) {
        throw new Error("All fields are required");
      }

      const normalizedEmail = email.toLowerCase().trim();

      const existingUser = await User.findOne({ email: normalizedEmail });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email: normalizedEmail,
        password: hashedPassword
      });

      const token = generateToken(user._id);

      const safeUser = await User.findById(user._id).select("-password");

      return {
        user: safeUser,
        token
      };

    } catch (error) {

      console.error("AuthService.registerUser Error:", error.message);
      throw error;

    }

  }

  async loginUser({ email, password }) {

    try {

      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const normalizedEmail = email.toLowerCase().trim();

      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = generateToken(user._id);

      const safeUser = await User.findById(user._id).select("-password");

      return {
        user: safeUser,
        token
      };

    } catch (error) {

      console.error("AuthService.loginUser Error:", error.message);
      throw error;

    }

  }

}

export const authService = new AuthService();