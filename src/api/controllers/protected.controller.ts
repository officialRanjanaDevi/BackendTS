// export async function verifyMqttClient(accessToken: string) {
//   return jwt.verify(accessToken, process.env.PRIVATE_KEY);
// }
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export interface User {
  role: "customer" | "admin";
  access_level: number;
  // Add other properties from your User interface
  id: string;
  // ... other properties ...
}
export class ProtectedController {
  static async protectedRoute(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const token = request.header("Authorization"); // Get token from request header
      if (!token) {
        response.status(401).json({ message: "Unauthorized: No token provided" });
        return;
      }
      // Verify and decode the token
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          response.status(401).json({ message: "Unauthorized: Invalid token" });
          return;
        }

        // Ensure decoded is an object and has the expected properties
        if (typeof decoded !== "object" || !("id" in decoded) || !("role" in decoded) || !("access_level" in decoded)) {
          response.status(401).json({ message: "Unauthorized: Invalid token payload" });
          return;
        }

        // Token is valid, use the decoded payload as user data
        const user: User = decoded as User; // Cast decoded as User type
        if (user.role === "admin" || (user.role === "customer" && user.access_level >= 2)) {
          // Authorized users can access the protected route
          response.status(200).json({ message: "Protected route accessed successfully" });
        } else {
          // Unauthorized users receive a 403 Forbidden response
          response.status(403).json({ message: "Access forbidden" });
        }
      });
    } catch (err) {
      next(err);
    }
  }
}
