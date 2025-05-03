import { v2 as cloudinary } from "cloudinary";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import fs from "fs";
import { Model, Document } from "mongoose";
import Coupon, { ICoupon, CouponStatus } from "../../models/coupon.model";
import { applyCoupon,applyStudentCoupon,getStudentCoupon } from "../../services/coupon.service";
import Domain from "../../models/domain.model";
dotenv.config({ path: ".env" });


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class CouponController {
  static createCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponData: any = {
        code: req.body.code,
        discount: req.body.discount,
        validFrom: req.body.validFrom,
        validTo: req.body.validTo,
        status: CouponStatus.ACTIVE,
        minimumPurchaseAmount: req.body.minimumPurchaseAmount
      };

      const coupon = await Coupon.create(couponData);
      res.status(201).json(coupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to create coupon" });
    }
  };

  static getCoupons = async (req: Request, res: Response): Promise<void> => {
    try {
      const coupons = await Coupon.find();
      res.status(200).json(coupons);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  };
 
  static verifyDomain=async (req: Request, res: Response): Promise<void> => {
    try {
      const {email}=req.body;
      const {couponType}=req.params;
      const extractdomain = (email) => {
        const match = email.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/);
        return match ? match[1] : null;
      };
      const domain=extractdomain(email)
      const coupons = await Domain.findOne({couponType:couponType,domain:domain,status:"active"});
      if(coupons){
        res.status(200).json(coupons);

      }else{
      res.status(500).json({ message:"Not valid for applying this coupon" });

      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupons" });
    }
  };

  static getCouponById = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponId = req.params.id;

      const coupon = await Coupon.findById(couponId);
      if (!coupon) {
        res.status(404).json({ message: "Coupon not found" });
        return;
      }

      res.status(200).json(coupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch coupon" });
    }
  };

  static updateCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponId = req.params.id;
      const couponData: Partial<ICoupon> = req.body;

      const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, couponData, { new: true });
      if (!updatedCoupon) {
        res.status(404).json({ message: "Coupon not found" });
        return;
      }
      res.status(200).json(updatedCoupon);
    } catch (error) {
      res.status(500).json({ error: "Failed to update coupon" });
    }
  };

  static deleteCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const couponId = req.params.id;

      const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
      if (!deletedCoupon) {
        res.status(404).json({ message: "Coupon not found" });
        return;
      }
      res.status(200).json({ message: "Coupon deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete coupon" });
    }
  };

  static applyCoupon = async (req: Request, res: Response): Promise<void> => {
    try {
      const { couponCode, purchaseAmount } = req.body;

      const response = await applyCoupon(couponCode, purchaseAmount);

      if (response.error) {
        res.status(response.statusCode).json({ error: response.error });
      } else {
        res.status(200).json({ message: "Coupon applied successfully" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to apply coupon" });
    }
  };

  static uploadSchoolId=async(req:Request,res:Response):Promise<void>=>{
    try{
   
        if (!req.file) {
           res.status(400).json({ error: "Please upload your school ID" });
           return;
        }
      
        const image = req.file.path;
        const name = req.file.filename; 
        const couponType = req.params.couponType;
        const userId = req.params.userId;
      
        const existingCoupon = await getStudentCoupon(couponType, userId);
        let response;
      
        if (!existingCoupon) {
          response = await applyStudentCoupon(image, name, couponType, userId);
        } else {
          existingCoupon.schoolId={
            filename:name,
            url:image};
          await existingCoupon.save();
          response = existingCoupon;
        }
      
        const discount = await Domain.findOne({ couponType: "school" ,status:"active"})
          .sort({ createdAt: -1 })
          .limit(1);
      
        if (response) {
          res.status(200).json({ message: "Coupon applied successfully", discount, response });
        } else {
          res.status(500).json({ error: "Failed to apply coupon" });
        }
      } catch (error) {
        console.error("Error applying coupon:", error);
        res.status(500).json({ error: "Failed to apply coupon" });
      }
      
  
  }
  static getSchoolId=async (req:Request,res:Response):Promise<void>=>{
     try{
      const couponType=req.params.couponType;
      const userId=req.params.userId;
      const response=await getStudentCoupon(couponType,userId);
      const discount = await Domain.find({ couponType: "school" ,status:"active"})
      .sort({ createdAt: -1 })
      .limit(1);

      if (response) {
        res.status(200).json({ message: "Coupon applied successfully" ,discount,response});

      } else {
        res.status(500).json({ error: "Failed to aplly coupon" });

      }
     }catch(error){
      res.status(500).json({ error: "Failed to get coupon" });
     }
  }
}
