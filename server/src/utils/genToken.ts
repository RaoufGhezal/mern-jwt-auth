import jwt from "jsonwebtoken";

type result = {
  accessToken: string;
  refreshToken: string;
};

export let genToken = (userId: string, sessionId: string): result => {
  let refreshToken = jwt.sign({ sessionId }, process.env.secret || "secret", {
    expiresIn: "7d",
  });

  let accessToken = jwt.sign(
    { userId, sessionId },
    process.env.secret || "secret",
    {
      expiresIn: "15m",
    },
  );

  return { accessToken, refreshToken };
};
