import SessionModel from "../models/session.model.js";

export async function createSession(
  req,
  user,
  refreshToken
) {
  return SessionModel.create({
    user: user._id,

    refreshToken,

    userAgent:
      req.headers["user-agent"],

    ipAddress:
      req.ip,

    expiresAt: new Date(
      Date.now() +
      7 * 24 * 60 * 60 * 1000
    ),
  });
}