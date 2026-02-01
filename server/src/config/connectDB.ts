import mongoose from "mongoose";

let MongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/";

export let connectDB = async () => {
  try {
    await mongoose.connect(MongoURI);
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Failed to connect to database:", err);
  }
};
