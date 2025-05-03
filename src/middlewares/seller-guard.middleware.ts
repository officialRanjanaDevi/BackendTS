import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization.split(" ")[1];
  //   console.log(token);
  if (!token) return res.sendStatus(401);

  jwt.verify(token, "trialshopy", (err, user) => {
    if (err) return res.sendStatus(403);

    // Make user data available in the request
    (req as any).user = user;
    next();
  });
}
