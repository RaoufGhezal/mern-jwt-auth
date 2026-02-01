import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { genToken } from "../utils/genToken";
import { User } from "../models/User";
import { Session } from "../models/Session";

export let registerController = async (req: Request, res: Response) => {
  let { fullName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: "Email already exists" });
    }

    let hashedPassword = await bcrypt.hash(password, 10);
    password = hashedPassword;

    user = new User({
      fullName,
      email,
      password,
    });
    await user.save();

    let session = new Session({
      userId: user._id,
    });
    await session.save();

    let { refreshToken, accessToken } = genToken(
      String(user._id),
      String(session._id),
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.node === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/api/auth/refresh-token",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.node === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 min
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("User registration failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export let loginController = async (req: Request, res: Response) => {
  let { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    let session = new Session({
      userId: user._id,
    });
    await session.save();

    let { refreshToken, accessToken } = genToken(
      String(user._id),
      String(session._id),
    );

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.node === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/api/auth/refresh-token",
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.node === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 min
      })
      .status(200)
      .json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      });
  } catch (err) {
    console.error("User login failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export let logoutController = async (req: Request, res: Response) => {
  try {
    let sessionId = (req as any).sessionId;
    if (sessionId) {
      await Session.findByIdAndDelete(sessionId);
    }

    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("User logout failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export let refreshTokenController = async (req: Request, res: Response) => {
  try {
    let sessionId = (req as any).sessionId;

    let session = await Session.findById(sessionId);
    if (!session)
      return res.status(401).json({ message: "Session not found or expired" });

    let userId = session.userId;

    let { accessToken } = genToken(String(userId), String(sessionId));

    return res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.node === "production",
        sameSite: "strict",
        maxAge: 10 * 60 * 1000, // 10 min
      })
      .status(200)
      .json({ message: "Token refreshed successfully" });
  } catch (err) {
    console.error("Token refresh failed:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
