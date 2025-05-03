import Order from "../models/order.model";
import Product from "../models/product.model";
import { IorderUpdate } from "../interfaces/order.interface";
import PaymentModel from "../models/payment.model";
import SubOrder from "../models/suborder.model";

export class OrderService {
  static calculateRecommendedProducts: any;
  async updateStock(id: any, quantity: number) {
    const product = await Product.findById(id);
    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });
  }

  async createOrder(data: any) {
    if (!data.products || data.products.length === 0) {
      return { status: 400, message: "Items are required" };
    }

    try {
      let totalOrderPrice = 0;

      const suborders = await SubOrder.insertMany(
        data.products.map((item, index) => {
          return {
            productId: item.product,
            size: item.size,
            storeId: item.storeId,
            skuId: item.skuId,
            quantity: item.quantity,
            returnLastDate: item.returnLastDate,
            mrp: item.mrp,
            finalPrice: item.finalPrice,
            subOrderId: `OrderId_${index + 1}`,
            statusUpdates: {
              status: item.orderStatus
            }
          };
        })
      );

      // console.log("suborders", suborders);

      const order = new Order({
        products: suborders.map((suborder) => suborder._id),
        userId: data.userId,
        shippingAddress: data.shippingAddress,
        coupon:data.coupon
      });

      // console.log("order", order);

      const newOrder = await order.save();

      await Promise.all(
        suborders.map((suborder, index) => {
          suborder.orderId = newOrder._id;
          suborder.subOrderId = `${newOrder._id}_${index + 1}`;
          return suborder.save();
        })
      );

      const payments = await PaymentModel.insertMany(
        suborders.map((suborder) => {
          return {
            orderId: suborder.orderId,
            storeId: suborder.storeId,
            suborderId: suborder._id,
            finalPrice: suborder.finalPrice
          };
        })
      );

      return { status: 201, newOrder };
    } catch (err) {
      return { status: 400, message: err.message };
    }
  }

  async myOrders(userId: string, limit: number, page: number) {
    const skip = (page - 1) * limit;
    // const orders = await Order.find({ userId: userId }).populate("userId").populate("products").sort({ orderDate: -1 }).limit(limit).skip(skip).lean().exec();
    const orders = await Order.find({
      userId: userId,
      status: { $ne: "pending" } // Exclude orders with status 'pending'
    })
      .populate("userId")
      .populate("products")
      .sort({ orderDate: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();

    return orders;
  }

  async getAllOrders(limit: number, page: number) {
    const orders = await Order.find()
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    return orders;
  }

  async updateOrder(orderId: string, updatedData: IorderUpdate) {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        status: 404,
        comment: "Order not found"
      };
    }
    if (!Array.isArray(order.products)) {
      return {
        status: 400,
        comment: "Invalid products format"
      };
    }

    await Order.findOneAndUpdate({ _id: order._id }, updatedData, { new: true }).exec();

    return {
      status: 200,
      message: "Order Updated"
    };
  }

  async updateSubOrder(orderId: string, updatedData: IorderUpdate) {
    // console.log("orderId", orderId);
    // console.log("updatedData", updatedData);
    const order = await SubOrder.findById(orderId);
    if (!order) {
      return {
        status: 404,
        comment: "Order not found"
      };
    }

    await SubOrder.findOneAndUpdate({ _id: order._id }, updatedData, { new: true }).exec();

    return {
      status: 200,
      message: "SubOrder Updated"
    };
  }

  async deleteOrder(orderId: string) {
    const order = await Order.findById(orderId);
    if (!order) {
      return {
        status: 404,
        comment: "Order not found"
      };
    }

    await order.remove();

    return {
      status: 200,
      message: "Order Deleted"
    };
  }

  //   private async calculateRecommendedProducts(userId: any) {
  //     const customerOrders = await Order.find({ userId: userId }).lean();
  //     const productCounts = {};

  //     for (const order of customerOrders) {
  //       for (const product of order.products) {
  //         if (!productCounts[product.product.toString()]) {
  //           productCounts[product.product.toString()] = 0;
  //         }
  //         productCounts[product.product.toString()] += product.quantity;
  //       }
  //     }

  //     const sortedProducts = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a]);
  //     const recommendedProducts = await Product.find({ _id: { $in: sortedProducts } }).lean();

  //     return recommendedProducts;
  //   }

  //   static async getRecommendedProducts({ userId }: { userId: string }): Promise<Product[]> {
  //     const recommendedProducts = await this.calculateRecommendedProducts(userId);
  //     return recommendedProducts;
  //   }
}

export const orderService = new OrderService();
