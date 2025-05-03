import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

import * as JWT from "jsonwebtoken";
import { IUser } from "../interfaces/user.interface";
import User from "../models/user.model";

export interface AuthenticatedUserRequest extends Request {
  user?: IUser | null;
  token?: string;
}

export const requireSignIn = async (req: AuthenticatedUserRequest, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }
    const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
    // console.log(JWT_SECRET);
    // console.log(typeof(JWT_SECRET));
    const decoded = JWT.verify(token, JWT_SECRET as string) as JWT.JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found. Please log in again." });
    }

    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(401).json({ 
                        message: "Not Authorized. Please log in again.",
                        "Error": error
    });
  }
};

export const returnErrorMessage = (message = "Unauthorized", code = 401, error = "Unauthorized") => {
  return { message, code, error };
};
/**
 * JWT Guard Middleware :
 *
 *  The middleware checks the whether the requested user has the right permissions or not to
 * the respective route based on claims available in the access token passed in the header with key value "authorization" (Bearer Tokens are accepted)
 * @param  {string} secret
 * @param  {jsonwebtoken.VerifyOptions={complete:true}} token_options
 */
export const guard = (secret: string, feature_permission_combinations: string, token_options: jsonwebtoken.VerifyOptions = { complete: true }) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const path = request.path;
    const params = request.params;
    let newPath = path;
    if (Object.keys(params).length >= 1) {
      Object.keys(params).forEach((key) => {
        newPath = newPath.replace(params[key], `:${key}`);
      });
    }

    const bearerToken = request.header("authorization");

    if (undefined === bearerToken) {
      const message = returnErrorMessage();
      return response.status(message.code).json(message);
    }

    const token = bearerToken.replace("Bearer ", "");

    let levelOfAccess;

    try {
      const access = {
        "1": ["user_1", "address_1"],
        "2": ["user_2", "address_2", "seller_1"],
        "3": ["seller_2"]
      };
      const { payload }: any = jsonwebtoken.verify(token, secret, token_options);
      if (undefined === payload.access_level) {
        const message = returnErrorMessage("Access Token Payload Does Not Contain the level of access Fields");
        return response.status(message.code).json(message);
      }

      levelOfAccess = payload.access_level;
      let claims: string[] = access[levelOfAccess];
      const claimIndex = claims.find((c) => c === feature_permission_combinations);
      if (undefined === claimIndex) {
        const message = returnErrorMessage();
        return response.status(message.code).json(message);
      }
      const claim: string[] = claims[claimIndex];
      claim.push("*");
      let requiredClaim = "";

      switch (request.method.toLocaleLowerCase()) {
        case "delete":
          requiredClaim = "delete";
          break;
        case "post":
          requiredClaim = "create";
          break;
        case "put":
          requiredClaim = "update";
          break;
        default:
          requiredClaim = "view";
          break;
      }
      if (claim.includes("*")) return next();
      if (!claim.includes(requiredClaim)) {
        const message = returnErrorMessage();
        return response.status(message.code).json(message);
      }
    } catch (error) {
      const message = returnErrorMessage(error.message);
      return response.status(message.code).json(message);
    }

    next();
  };
};
