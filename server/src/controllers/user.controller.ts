import { Request, Response } from "express";

import { User } from "../models/User";

export let userController = async (req: Request, res: Response) => {
  try {
    let userId = (req as any).userId;

    let user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res
      .status(200)
      .json({ message: "User retrieved successfully", user });
  } catch (err) {
    console.error("Failed to retrieve user:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
