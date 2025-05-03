import { NextFunction, Request, Response } from "express";
import { ReviewService } from "../../services/review.service";
import { loginCheck } from "../../middlewares/logincheck.middleware";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: function (req, file, cb) {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  }
}).array("pictures", 5); // Use .array() to handle multiple file uploads

export class ReviewController {
  static async getReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = request.params;
      const reviewService = new ReviewService();
      const review = await reviewService.getReview(productId);
      response.json(review);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async addReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    // loginCheck(request, response, async () => {

    const userId = request.params.userId;
    const productId = request.params.productId;
    const reviewData = { userId, productId, ...request.body };
    const reviewService = new ReviewService();
    // console.log("reviewData", reviewData);
    try {
      const newReview = await reviewService.addReview(reviewData);
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
      const reviewService = new ReviewService();
      try {
        const updatedReview = await reviewService.updateReview(id, reviewData);
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
      const reviewService = new ReviewService();
      try {
        await reviewService.deleteReview(id);
        response.json({ message: "Review deleted successfully" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }

  // Revoke a review by its ID
  static async revokeReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    loginCheck(request, response, async () => {
      const { id } = request.params;
      const reviewService = new ReviewService();
      try {
        await reviewService.revokeReview(id);
        response.json({ message: "Review revoked successfully" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }

  // Delete a user's review for a specific product
  static async deleteUserReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    loginCheck(request, response, async () => {
      const { userId, productId } = request.params;
      const reviewService = new ReviewService();
      try {
        await reviewService.deleteUserReview(userId, productId);
        response.json({ message: "User's review for the product deleted successfully" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "Internal Server Error" });
      }
    });
  }

  // Like a review
  static async likeReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = request.user.id;
      const { reviewId } = request.params;
      const result = await new ReviewService().likeReview(reviewId, userId);
      response.json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  }

  // Dislike a review
  static async dislikeReview(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const userId = request.user.id;
      const { reviewId } = request.params;
      const result = await new ReviewService().dislikeReview(reviewId, userId);
      response.json(result);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: error.message });
    }
  }

  //Upload images

  static async uploadImages(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      // Use multer to handle file uploads
      upload(request, response, async function (err: any) {
        if (err instanceof multer.MulterError) {
          // A multer error occurred
          return response.status(400).json({ error: err.message });
        } else if (err) {
          // Other errors occurred
          return response.status(500).json({ error: "Internal Server Error" });
        }

        // Files uploaded successfully, extract files from request
        const files: Express.Multer.File[] = request.files as Express.Multer.File[];
        const images = files.map((file: Express.Multer.File) => ({
          filename: file.filename,
          url: file.path
        }));

        // Call the service to upload images to the review
        const result = await new ReviewService().uploadImages(request.params.reviewId, images);

        response.status(200).json({ comment: "Files uploaded successfully", data: result, newFiles: images });
      });
    } catch (err) {
      // Handle other errors
      console.error(err);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  // Count the number of pictures in a review
  static async countPictures(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const { productId } = request.params;
      const reviewService = new ReviewService();
      const pictureCount = await reviewService.countPictures(productId);
      response.json({ pictureCount });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
