import Cart from "../models/cart.model";
import Product from "../models/product.model";

export class CartService {
  async getCart(customerId: string, language?: string) {
    const cart = await Cart.find({ customerId: customerId }).populate("items.productId").populate("shippingAddress").exec();
    return cart;
  }

  async addItem(productId: string, customerId: string, language: string, count: number, size: string) {
    const product = await Product.findOne({ _id: productId }).exec();
    const cart = await Cart.findOne({ customerId: customerId }).exec();
    if (product) {
      if (cart) {
        const existingProductIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

        if (existingProductIndex !== -1) {
          // If the product exists, increment the count
          cart.items[existingProductIndex].count += 1;
        } else {
          // If the product doesn't exist, add it to the cart
          cart.items.push({ productId: productId, count: count, size });
        }
        await cart.save();
        return { ItemAddition: "Successful", CartData: cart };
      } else {
        const userCart = {
          customerId: customerId,
          items: [{ productId: productId, count: 1 }],
          document: []
        };
        //save cart in database
        const cartCreated = await Cart.create(userCart);
        return { ItemAddition: "Succesful", CartData: cartCreated };
      }
    } else {
      return { ItemAddition: "Unsuccesful", Comment: "Product not found" };
    }
  }

  async updateCartAddress(customerId: string, updatedData: any) {
    const cart = await Cart.findOneAndUpdate({ customerId: customerId }, updatedData, { new: true }).populate("shippingAddress").exec();
    if (!cart) return { Comment: "Cart not found" };
    return cart;
  }

  async deleteItem(customerId: string, productId: string) {
    const cart = await Cart.findOne({ customerId: customerId }).populate("items.productId").exec();
    if (cart) {
      cart.items = cart.items.filter((item) => item.productId);

      const foundProduct = cart.items.find((item) => item.productId._id.toString() === productId);

      if (foundProduct) {
  
          cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);
      
        const result = await cart.save();
        return { ItemDeletion: "Successful", CartData: result };
      } else {
        return { Comment: "Product not found in the cart" };
      }
    } else {
      return { Comment: "Cart not found" };
    }
  }

  //It completely removes the product from the items array
  async removeProduct(customerId: string, productId: string) {
    const result = await Cart.findOneAndUpdate({ customerId: customerId, "items.productId": productId }, { $pull: { items: { productId: productId } } }, { new: true });

    if (!result) return { Comment: "Cart not found" };

    return result;
  }
}
