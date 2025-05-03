import { NextFunction, Request, Response } from "express";
import { loginCheck } from "../../middlewares/logincheck.middleware";
import { StoreReviewService } from "../../services/storeReview.service";
export class StoreReviewController {
  static async getReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { storeId } = request.params;

      const review = await new StoreReviewService().getReview(storeId);
      response.json(review);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async addReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    // loginCheck(request, response, async () => {

    const userId = request.params.userId;
    const storeId = request.params.storeId;
    const reviewData = { userId, storeId, ...request.body };

    try {
      const newReview = await new StoreReviewService().addReview(reviewData);
      response.json(newReview);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    loginCheck(request, response, async () => {
      const { id } = request.params;
      const reviewData = request.body;
      try {
        const updatedReview = await new StoreReviewService().updateReview(id, reviewData);
        response.json(updatedReview);
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }

  static async deleteReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    loginCheck(request, response, async () => {
      const { id } = request.params;

      try {
        await new StoreReviewService().deleteReview(id);
        response.json({ message: "Review deleted successfully" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }

  static async revokeReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    loginCheck(request, response, async () => {
      const { id } = request.params;
      try {
        await new StoreReviewService().revokeReview(id);
        response.json({ message: "Review revoked successfully" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }
}
