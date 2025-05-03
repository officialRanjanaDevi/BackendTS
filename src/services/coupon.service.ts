import Coupon, { ICoupon, CouponStatus } from "../models/coupon.model";
import SchoolCoupon,{ISchool} from "../models/studentCoupon.model";
import { Model, Document } from "mongoose";
import { canApplyCoupon } from "../coupon.utils";

export const createCoupon = async (couponData: ICoupon): Promise<ICoupon> => {
  try {
    const coupon = await Coupon.create(couponData);
    return coupon;
  } catch (error) {
    throw new Error("Failed to create coupon");
  }
};

export const getAllCoupons = async (): Promise<ICoupon[]> => {
  try {
    const coupons = await Coupon.find();
    return coupons;
  } catch (error) {
    throw new Error("Failed to fetch coupons");
  }
};

export const getCouponById = async (couponId: string): Promise<ICoupon | null> => {
  try {
    const coupon = await Coupon.findById(couponId);
    return coupon;
  } catch (error) {
    throw new Error("Failed to fetch coupon");
  }
};

export const updateCoupon = async (couponId: string, couponData: Partial<ICoupon>): Promise<ICoupon> => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(couponId, couponData, { new: true });
    if (!updatedCoupon) {
      throw new Error("Coupon not found");
    }
    return updatedCoupon;
  } catch (error) {
    throw new Error("Failed to update coupon");
  }
};

export const deleteCoupon = async (couponId: string): Promise<void> => {
  try {
    const deletedCoupon = await Coupon.findByIdAndDelete(couponId);
    if (!deletedCoupon) {
      throw new Error("Coupon not found");
    }
  } catch (error) {
    throw new Error("Failed to delete coupon");
  }
};

export const applyCoupon = async (couponCode: string, purchaseAmount: number): Promise<{ statusCode: number; error?: string }> => {
  try {
    const coupon = await getCouponByCode(couponCode); // Make sure you've defined and imported this function
    if (!coupon) {
      return { statusCode: 404, error: "Coupon not found" };
    }

    if (!canApplyCoupon(coupon, purchaseAmount)) {
      // Make sure you've defined and imported this function
      return { statusCode: 400, error: "Purchase amount is below the minimum required for this coupon" };
    }

    // Apply the coupon logic here...

    return { statusCode: 200 };
  } catch (error) {
    return { statusCode: 500, error: "Failed to apply coupon" };
  }
};

export const getCouponByCode = async (couponCode: string): Promise<ICoupon | null> => {
  try {
    const coupon = await Coupon.findOne({ code: couponCode });
    return coupon;
  } catch (error) {
    throw new Error("Failed to fetch coupon by code");
  }
};

export const  applyStudentCoupon=async (image:string,name:string,couponType:string,userId:string):Promise <ISchool|null>=>{
  try {
    const coupon = await SchoolCoupon.create({couponType,schoolId:{filename:name,url:image},userId});
    return coupon;
  } catch (error) {
    throw new Error("Failed to fetch coupon by code");
  }
}
export const  getStudentCoupon=async (couponType:string,userId:string):Promise <ISchool|null>=>{
  try {
    const coupon = await SchoolCoupon.findOne({couponType,userId});
    return coupon;
  } catch (error) {
    throw new Error("Failed to fetch coupon by code");
  }
}

