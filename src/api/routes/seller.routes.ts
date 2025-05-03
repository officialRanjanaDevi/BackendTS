import { Router } from "express";
import { SellersController } from "../controllers/seller/SellersController";
import { authenticateToken } from "../../middlewares/seller-guard.middleware";

export class SellerRoute {
  static register() {
    const router = Router();

    // Route for Login
    router.route("/login").post(SellersController.login);
    router.route("/logout").get(SellersController.logout);

    // Route to get all products
    router.route("/allProducts").post(authenticateToken, SellersController.getAllProducts);

    return router;
  }
}
