import { ObjectId } from "bson";
import Review, { IReview } from "../models/review.model";
import mongoose from "mongoose";
import User from "../models/user.model";

export class ReviewService {
  async getReview(productId: string) {
    try {
      const reviews = await Review.find({ productId, status: "active" }).populate("userId").exec();
      return reviews;
    } catch (error) {
      throw new Error("Error fetching reviews");
    }
  }

  async addReview(reviewData: any) {
    try {
      const newReview = await Review.create(reviewData);
      const review=await Review.findById(newReview._id).populate("userId")
      return review;
    } catch (error) {
      throw new Error("Error adding review");
      // console.log("error", error);
    }
  }

  async updateReview(reviewId: string, reviewData: any) {
    try {
      const updatedReview = await Review.findByIdAndUpdate(reviewId, reviewData, {
        new: true
      }).exec();
      return updatedReview;
    } catch (error) {
      throw new Error("Error updating review");
    }
  }

  // Delete a review by its ID
  async deleteReview(reviewId: string) {
    try {
      await Review.findByIdAndDelete(reviewId).exec();
    } catch (error) {
      throw new Error("Error deleting review");
    }
  }

  // Revoke a review by its ID
  async revokeReview(reviewId: string) {
    try {
      await Review.findByIdAndDelete(reviewId).exec();
    } catch (error) {
      throw new Error("Error revoking review");
    }
  }

  // Delete a user's review for a specific product
  async deleteUserReview(userId: string, productId: string) {
    try {
      await Review.findOneAndDelete({ userId, productId }).exec();
    } catch (error) {
      throw new Error("Error deleting user's review for the product");
    }
  }

  // Like a review
  async likeReview(reviewId: string, userId: mongoose.Schema.Types.ObjectId) {
    try {
      const review = await Review.findById(reviewId).exec();
      if (!review) {
        throw new Error("Review not found");
      }

      if (review.likes.includes(userId)) {
        throw new Error("Already Liked");
      } else {
        review.likes.push(userId);

        if (review.dislikes.includes(userId)) {
          review.dislikes = review.dislikes.filter((dislike) => dislike.toString() !== userId.toString());
        }
      }

      await review.save();
      return review;
    } catch (error) {
      throw new Error("Error reacting to review");
    }
  }

  // Dislike a review
  async dislikeReview(reviewId: string, userId: mongoose.Schema.Types.ObjectId) {
    try {
      const review = await Review.findById(reviewId).exec();
      if (!review) {
        throw new Error("Review not found");
      }

      if (review.dislikes.includes(userId)) {
        throw new Error("Already disliked");
      } else {
        review.dislikes.push(userId);

        if (review.likes.includes(userId)) {
          review.likes = review.likes.filter((like) => like.toString() !== userId.toString());
        }
      }
      await review.save();
      return review;
    } catch (error) {
      throw new Error("Error disliking review");
    }
  }

  // Upload Images
  async uploadImages(reviewId: string, images: any[]) {
    return await Review.findByIdAndUpdate(reviewId, { $push: { pictures: { $each: images } } }).exec();
  }

  //count picture in review of product
  async countPictures(productId: string): Promise<number> {
    try {
      const reviews = await Review.find({ productId, status: "active" });
      let pictureCount = 0;

      reviews.forEach((review) => {
        if (review.pictures && Array.isArray(review.pictures)) {
          pictureCount += review.pictures.length;
        }
      });

      return pictureCount;
    } catch (error) {
      throw new Error("Error counting pictures in reviews");
    }
  }

  // async rateReview(reviewId: string, rating: number) {
  //   try {
  //     const review = await Review.findById(reviewId).exec();
  //     if (!review) {
  //       throw new Error("Review not found");
  //     }

  //     review.rating = rating;

  //     await review.save();
  //     return review;
  //   } catch (error) {
  //     throw new Error("Error rating review");
  //   }
  // }
}
