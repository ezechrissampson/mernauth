import { validateSessionToken } from "../services/sessionService.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const { user } = await validateSessionToken(token);

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error("Auth protect error:", err.message);
    return res
      .status(401)
      .json({ message: err.message || "Not authorized" });
  }
};
