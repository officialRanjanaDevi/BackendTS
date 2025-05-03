import  StoreReview  from "../models/storeReview.model";
import User from "../models/user.model";

export class StoreReviewService {
  async getReview(storeId: string) {
    try {
      const reviews = await StoreReview.find({ storeId }).populate({ path: "userId", model: User }).exec();
      return reviews;
    } catch (error) {
      throw new Error("Error fetching reviews");
    }
  }

  async addReview(reviewData: any) {
    try {
      const newReview = await StoreReview.create(reviewData);
      return newReview;
    } catch (error) {
      throw new Error("Error adding review");
    }
  }

  async updateReview(reviewId: string, reviewData: any) {
    try {
      const updatedReview = await StoreReview.findByIdAndUpdate(reviewId, reviewData, {
        new: true
      }).exec();
      return updatedReview;
    } catch (error) {
      throw new Error("Error updating review");
    }
  }

  async deleteReview(reviewId: string) {
    try {
      await StoreReview.findByIdAndUpdate(
        { _id: reviewId, $set: { status: "inactive" } },
        {
          new: true
        }
      ).exec();
    } catch (error) {
      throw new Error("Error deleting review");
    }
  }

  async revokeReview(reviewId: string) {
    try {
      await StoreReview.findByIdAndDelete(reviewId).exec();
    } catch (error) {
      throw new Error("Error revoking review");
    }
  }
}
