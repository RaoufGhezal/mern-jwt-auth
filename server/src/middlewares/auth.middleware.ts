import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

type DecodedToken = {
  userId?: string;
  sessionId: string;
};

export let authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Access token required" });

  try {
    let decoded = jwt.verify(
      token,
      process.env.secret || "secret",
    ) as DecodedToken;

    (req as any).userId = decoded.userId;
    (req as any).sessionId = decoded.sessionId;

    next();
  } catch (err) {
    console.error("Access token validation failed:", err);
    return res.status(401).json({ message: "Invalid access token" });
  }
};

export let validateRefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let token = req.cookies.refreshToken;
  if (!token)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    let decoded = jwt.verify(
      token,
      process.env.secret || "secret",
    ) as DecodedToken;

    (req as any).sessionId = decoded.sessionId;

    next();
  } catch (err) {
    console.error("Refresh token validation failed:", err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
