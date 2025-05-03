import { CouponStatus, ICoupon } from "./models/coupon.model";

export const canApplyCoupon = (coupon: ICoupon, purchaseAmount: number): boolean => {
  return coupon.status === CouponStatus.ACTIVE && purchaseAmount >= coupon.minimumPurchaseAmount;
};
