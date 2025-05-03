import Product from "../models/product.model";
import csv from "csv-parser";
import fs from "fs";
export class ProductBulkUploader {
  private filePath: string;
  private sellerId: string;
  private storeId: string;

  constructor(filePath: string, sellerId: string, storeId: string) {
    this.filePath = filePath;
    this.sellerId = sellerId;
    this.storeId = storeId;
  }

  async importProductsFromCSV(): Promise<void> {
    try {
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on("data", async (data: any) => {
          const productData = {
            gstId: data.gstId,
            storeId: this.storeId,
            sellerId: this.sellerId,
            categoryId: data.categoryId,
            brandId: data.brandId,
            productName: data.productName,
            shortDescription: data.shortDescription,
            fullDescription: data.fullDescription,
            status: data.status,
            category: data.category,
            subcategory: data.subcategory,
            tags: data.tags,
            manufacturer: data.manufacturer,
            price: data.price,
            isDiscount: data.isDiscount,
            discount: data.discount,
            inStock: data.inStock,
            stock: data.stock,
            shippingCharge: data.shippingCharge,

            metaTitle: data.metaTitle,
            metaKeywords: data.metaKeywords,
            metaDescription: data.metaDescription
          };
          console.log("product Data :", productData);

          const product = new Product(productData);
          await product.save();
        })
        .on("end", () => {
          console.log("Products imported successfully!");
        })
        .on("error", (error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }
}
