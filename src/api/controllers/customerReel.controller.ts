import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import fs from "fs";
import CustomerReel from "../../models/customerReel.model";
import User from "../../models/user.model";
import mongoose,{ Types } from "mongoose";
import customers from "razorpay/dist/types/customers";
dotenv.config({ path: ".env" });


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export class CustomerReelController {
  // Upload reel by customer
  static async uploadReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const customer = await User.findById(id);
      if (!customer) {
        return next({ code: 404, message: "Customer not found", error: "Invalid customer ID" });
      }

      if (!req.file) {
        return next({ code: 400, message: "No file uploaded", error: "Please provide a video file" });
      }

      const videoPath = req.file.path;
      const { caption } = req.body;

      const reelUpload = await cloudinary.uploader.upload(videoPath, {
        resource_type: "video",
        folder: "reels",
      });

      fs.unlinkSync(videoPath);


      const uploadedReel = await CustomerReel.create({
        customerId: id,
        video: reelUpload.secure_url,
        caption,
      });

      res.status(201).json({
        success: true,
        message: "CustomerReel uploaded successfully",
        data: uploadedReel,
      });

    } catch (err: any) {
      console.error("Error uploading reel:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  // Delete a particular reel uploaded by the customer
  static async deleteReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {userId}=req.body;
      const reels = await CustomerReel.findOneAndDelete({customerId:userId,_id:id});
      if(!reels){
        next({ code: 404, message: "Failed to delete", error: "Invalid IDs" });
      }
      res.status(201).json({
        success: true,
        data: reels,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  // Get all reels uploaded by the customer
  static async getAllReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
   
      const objectId = new mongoose.Types.ObjectId(id); 

      const reels = await CustomerReel.aggregate([
        {
          $match:{customerId:objectId}
        },
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customer"
          }
        },
        { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
   
        {
          $lookup: {
            from: "users",
            localField: "likes.userId",
            foreignField: "_id",
            as: "likes.user"
          }
        },
        {
          $unwind: { path: "$likes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            likes: { $push: "$likes.user" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "likes": "$likes" }]
            }
          }
        },

        { $unwind: { path: "$dislikes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "dislikes.userId",
            foreignField: "_id",
            as: "dislikes.user"
          }
        },
        {
          $unwind: { path: "$dislikes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            dislikes: { $push: "$dislikes.user" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "dislikes": "$dislikes" }]
            }
          }
        },
      
        // Repeat for comments
        { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "comments.user"
          }
        },
        {
          $unwind: { path: "$comments.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            comments: {
              $push: {
                comment: "$comments.comment",
                user: "$comments.user"
              }
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "comments": "$comments" }]
            }
          }
        }
      ]);
      
      
      res.status(201).json({
        success: true,
        data: reels,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }

  //get all reels to show user 
  static async getAllReels(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reels = await CustomerReel.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "customerId",
            foreignField: "_id",
            as: "customer"
          }
        },
        // Unwind likes array
        { $unwind: { path: "$likes", preserveNullAndEmptyArrays: true } },
   
        {
          $lookup: {
            from: "users",
            localField: "likes.userId",
            foreignField: "_id",
            as: "likes.user"
          }
        },
        {
          $unwind: { path: "$likes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            likes: { $push: "$likes.user" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "likes": "$likes" }]
            }
          }
        },
      
        // Repeat for dislikes
        { $unwind: { path: "$dislikes", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "dislikes.userId",
            foreignField: "_id",
            as: "dislikes.user"
          }
        },
        {
          $unwind: { path: "$dislikes.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            dislikes: { $push: "$dislikes.user" }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "dislikes": "$dislikes" }]
            }
          }
        },
      
        // Repeat for comments
        { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "_id",
            as: "comments.user"
          }
        },
        {
          $unwind: { path: "$comments.user", preserveNullAndEmptyArrays: true }
        },
        {
          $group: {
            _id: "$_id",
            doc: { $first: "$$ROOT" },
            comments: {
              $push: {
                comment: "$comments.comment",
                user: "$comments.user"
              }
            }
          }
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: ["$doc", { "comments": "$comments" }]
            }
          }
        }
      ]);
      
      
      res.status(201).json({
        success: true,
        data: reels,
      });
    } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
  }


  static async likeReel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { id } = req.params;
        const {userId}=req.params;
        const reel = await CustomerReel.findById(id); 

        if (!reel) {
          return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
        }

        const alreadyLiked = reel.likes.some(
          (like) => like.userId.toString() === userId
        );
      
        let updatedReel;
       
        if (alreadyLiked) {
          // Remove like
          updatedReel = await CustomerReel.findByIdAndUpdate(
            reel._id,
            {
              $pull: { likes: { userId } },
            },
            { new: true }
          );
        } else {
          // Add like
          updatedReel = await CustomerReel.findByIdAndUpdate(
            reel._id,
            {
              $push: { likes: { userId } },
            },
            { new: true }
          );
        }
 
        res.status(200).json({
            success: true,
            data: updatedReel,
        });
    } catch (err: any) {
        console.error("Error:", err);
        next({ code: 500, message: err.message || "Internal Server Error", error: err });
    }
}
static async dislikeReel(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const {userId}=req.params;
    const reel = await CustomerReel.findById(id); 

    if (!reel) {
      return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
    }

    const alreadyDisLiked = reel.dislikes.some(
      (dislike) => dislike.userId.toString() === userId
    );
  
    let updatedReel;
   
    if (alreadyDisLiked) {
      updatedReel = await CustomerReel.findByIdAndUpdate(
        reel._id,
        {
          $pull: { dislikes: { userId } },
        },
        { new: true }
      );
    } else {
      updatedReel = await CustomerReel.findByIdAndUpdate(
        reel._id,
        {
          $push: { dislikes: { userId } },
        },
        { new: true }
      );
    }

    res.status(200).json({
        success: true,
        data: updatedReel,
    });
  } catch (err: any) {
      console.error("Error:", err);
      next({ code: 500, message: err.message || "Internal Server Error", error: err });
  }
}

static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
try{
  const { id } = req.params;
  const {userId}=req.params;
  const {comment}=req.body;
  const reel = await CustomerReel.findById(id); 
    if (!reel) {
      return next({ code: 400, message: "No reel found", error: "incorrect reel id" });
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);
   const updatedReel = await CustomerReel.findByIdAndUpdate(
      reel._id,
      {
        $push: { comments: { userId: userObjectId ,comment} },
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      data: updatedReel,
  });
}catch (err: any) {
  console.error("Error:", err);
  next({ code: 500, message: err.message || "Internal Server Error", error: err });
}
}



}
