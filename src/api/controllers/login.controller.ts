import { NextFunction, Request, Response } from "express";
import { login, updatePassword } from "../../validation/login.schema";
import { LoginService } from "./../../services/login.service";
import { generateToken } from "../../middlewares/security.middleware";
import { UserService } from "../../services/user.service";
import { AuthenticatedUserRequest } from "../../middlewares/jwt-gaurd.middleware";

export class LoginController {
  static async Login(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result: any = await new LoginService().login({ ...request.body });

      // generate token
      if (result && result.Login == "Successful") {
        const token = generateToken(request, response, next, result.UserData);
        const userDetails = result.UserData;
        const userDetailsJSON = JSON.stringify(userDetails);

        response.cookie("userDetails", userDetailsJSON, {
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          httpOnly: true,
          secure: true,
          sameSite: "none"
        });
        // response.cookie("token", token, {
        //   expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        //   httpOnly: true,
        //   secure: true,
        //   sameSite: "none"
        // });
        response.status(200).json({ result, token });
      } else {
        response.status(400).json(result);
      }
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async checkLogin(req: AuthenticatedUserRequest, res: Response): Promise<void> {
    if (req.user && req.token) {
      res.status(200).json({
        message: "User is logged in",
        token: req.token,
        user: req.user
      });
    } else {
      res.status(401).json({ message: "User is not logged in" });
    }
  }
  static async logOutController(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      response.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
      response.clearCookie("userDetails", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
      });
      response.status(200).send({
        success: true,
        message: "Logout successful"
      });
    } catch (err) {
      response.status(500).send({
        success: false,
        message: "Logout failed"
      });
    }
  }

  // @validateRequestBody(updatePassword)
  static async updatePassword(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const language: any = request.headers["content-lang"] ?? "en";
      const result: any = await new LoginService().passwordUpdate({ ...request.body });
      response.status(201).json(result);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
