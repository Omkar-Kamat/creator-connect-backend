import mongoose from "mongoose";
import { User } from "../models/user.model.js";

export const deductToken = async (userId, amount = 1, session = null) => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID");
    }

    if (amount <= 0) {
        throw new Error("Invalid token amount");
    }

    const user = await User.findOneAndUpdate(
        {
            _id: userId,
            tokens: { $gte: amount },
        },
        {
            $inc: { tokens: -amount },
        },
        {
            new: true,
            session,
        },
    );

    if (!user) {
        throw new Error("Insufficient tokens");
    }

    return user;
};
