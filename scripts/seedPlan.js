import "dotenv/config";
import mongoose from "mongoose";
import { Plan } from "../models/plan.model.js";
import { database } from "../config/db.config.js";

const seed = async () => {
  await database.connect();

  await Plan.deleteMany({});

  await Plan.insertMany([
    {
      name: "Basic Plan",
      key: "basic",
      price: 99,
      tokens: 100,
      bonusTokens: 0,
      isActive: true
    },
    {
      name: "Pro Plan",
      key: "pro",
      price: 199,
      tokens: 200,
      bonusTokens: 20,
      isActive: true
    },
    {
      name: "Ultimate Plan",
      key: "ultimate",
      price: 500,
      tokens: 500,
      bonusTokens: 50,
      isActive: true
    }
  ]);

  console.log("Plans seeded");
  process.exit(0);
};

seed();