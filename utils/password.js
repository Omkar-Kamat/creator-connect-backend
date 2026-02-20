import bcrypt from "bcrypt";

export class PasswordService {
    constructor() {
        this.SALT_ROUNDS = 12;
    }

    async hashPassword(plainPassword) {
        try {
            if (!plainPassword) {
                throw new Error("Password is required");
            }

            return await bcrypt.hash(plainPassword, this.SALT_ROUNDS);
        } catch (error) {
            console.error("PasswordService.hashPassword Error:", error.message);
            throw error;
        }
    }

    async comparePassword(plainPassword, hashedPassword) {
        try {
            if (!plainPassword || !hashedPassword) {
                throw new Error("Both passwords are required");
            }

            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            console.error(
                "PasswordService.comparePassword Error:",
                error.message,
            );
            throw error;
        }
    }
}

export const passwordService = new PasswordService();
