import { Model } from "mongoose";
import Arrival from "../models/arrival.model";
import Product from "../models/product.model";

export class ArrivalService {
  async createArrival(data: any) {
    const arrival = new Arrival(data);
    return arrival.save();
  }

  async getArrival(arrivalId: string) {
    return await Arrival.findOne({ _id: arrivalId }).exec();
  }

  async getAllByCategoryArrivals(categoryId: string) {
    console.log(categoryId)
    return await Product.find({ categories: { $in: [categoryId] } }).sort({ dateAdded: -1 }).exec();
  }
  async getAllArrivals() {
    return await Product.find().sort({ dateAdded: -1 }).exec();
  }

  async updateArrival(arrivalId: string, data: any) {
    return await Arrival.findByIdAndUpdate(arrivalId, data, {
      new: true
    }).exec();
  }

  async deleteArrival(arrivalId: string) {
    return await Arrival.findByIdAndDelete(arrivalId).exec();
  }
}
