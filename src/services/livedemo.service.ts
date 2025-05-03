import LiveDemo from "../models/livedemo.model";
import Product from "../models/product.model";
import Store from "../models/store.model";
import mongoose, { Schema } from "mongoose";

function isValidObjectId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export class LiveDemoService {
  async getLiveDemo(customerId: string, language?: string) {
    if (!isValidObjectId(customerId)) {
      return { ProductRemoval: "Unsuccessful", Comment: "Invalid customerId" };
    }

    const liveDemo = await LiveDemo.findOne({ customerId })
      .populate({
        path: "items",
        populate: {
          path: "storeId",
          model: "store"
        }
      })
      .exec();
    if (!liveDemo) {
      const newLiveDemo = new LiveDemo({
        customerId: customerId,
        items: []
      });
      await newLiveDemo.save();
      return newLiveDemo;
    }
    return liveDemo;
  }

  async getLiveDemoByStore(customerId: string, storeId: string) {
    if (!isValidObjectId(customerId) || !isValidObjectId(storeId)) {
      return { ProductRemoval: "Unsuccessful", Comment: "Invalid customerId or storeId" };
    }

    const products = await Product.find({ storeId }).select("_id");
    const productIds = products.map((product) => product._id.toString());

    const liveDemo = await LiveDemo.findOne({
      customerId,
      items: { $in: productIds.map((id) => new mongoose.Types.ObjectId(id)) }
    }).populate({
      path: "items",
      match: { _id: { $in: productIds.map((id) => new mongoose.Types.ObjectId(id)) } },
      select: "_id productName productImage"
    });

    if (!liveDemo) {
      return { ProductRemoval: "Unsuccessful", Comment: "Product not found in liveDemo!" };
    }

    const filteredItems = liveDemo.items.filter((item: mongoose.Types.ObjectId) => productIds.includes(item._id.toString()));

    return {
      ...liveDemo.toObject(),
      items: filteredItems
    };
  }

  async addItem(productId: string, customerId: string, language: string = "en") {
    try {
      if (!isValidObjectId(productId) || !isValidObjectId(customerId)) {
        return { ItemAddition: "Unsuccessful", Comment: "Invalid productId or customerId" };
      }

      const [product, liveDemo] = await Promise.all([Product.findById(productId), LiveDemo.findOne({ customerId }).exec()]);

      if (!product) {
        return { ItemAddition: "Unsuccessful", Comment: "Product not found" };
      }

      const store = product.storeId ? await Store.findById(product.storeId).exec() : null;

      if (liveDemo) {
        const existingProduct = liveDemo.items.find((item) => item.toString() === productId);
        if (existingProduct) {
          return { isProductAdded: true, ItemAddition: "Unsuccessful", Comment: "Product already exists in the Live Demo" };
        } else {
          liveDemo.items.push(new mongoose.Types.ObjectId(productId)); // Ensure the ID is correctly formatted
          await liveDemo.save();
          return { ItemAddition: "Successful", liveData: liveDemo, product, store };
        }
      } else {
        const liveDemoCreated = new LiveDemo({
          customerId,
          items: [new mongoose.Types.ObjectId(productId)] // Ensure the ID is correctly formatted
        });
        await liveDemoCreated.save();
        return { ItemAddition: "Successful", liveData: liveDemoCreated, product, store };
      }
    } catch (err) {
      console.error("Error adding item:", err.message);
      throw new Error("An error occurred while adding the item. Please try again later.");
    }
  }

  async removeProduct(customerId: string, productId: string) {
    try {
      if (!isValidObjectId(customerId) || !isValidObjectId(productId)) {
        return { ProductRemoval: "Unsuccessful", Comment: "Invalid customerId or productId" };
      }

      const result = await LiveDemo.findOneAndUpdate(
        {
          customerId: customerId
        },
        { $pull: { items: productId } },
        { new: true }
      ).exec();
      // console.log("result", result);
      if (result) {
        return { ProductRemoval: "Successful", liveData: result };
      } else {
        return { ProductRemoval: "Unsuccessful", Comment: "Product not found in liveDemo!" };
      }
    } catch (error) {
      throw new Error(JSON.stringify({ code: 500, message: "Internal Server Error", error: error.message }));
    }
  }
}
