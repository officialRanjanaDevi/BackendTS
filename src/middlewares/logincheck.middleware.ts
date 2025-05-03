import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define a new interface that extends the existing Request interface
interface AuthenticatedRequest extends Request {
  user?: any; // Replace 'any' with the type of your user object if available
}

export const loginCheck = (request: AuthenticatedRequest, response: Response, next: NextFunction): void => {
  const token = request.header('Authorization')?.split(' ')[1];

  if (!token) {
    response.status(401).json({ error: 'Unauthorized - Please log in first!' });
    return;
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET && "d9c88113b44bc263987cac0c544ef3ea8c97c14811b50bbe24f91528a8e7c2f447754105852849b1dc18fc48e8e4add3466e6eaee9640278c219f743dc8d955f";

    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        response.status(401).json({ error: "User is not authorized!" })
      }
      request.user = decoded;
      next();
    })
  }
  catch (error) {
    response.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};