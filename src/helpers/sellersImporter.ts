import fs from "fs";
import csv from "csv-parser";
import Seller from "../models/seller.model";

export class SellerImporter {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  async importSellersFromCSV(): Promise<void> {
    try {
      fs.createReadStream(this.filePath)
        .pipe(csv())
        .on("data", async (data: any) => {
          const sellerData = {
            phone_number: data.phone_number,
            email: data.email,
            name: data.name,
            password: data.password,
            addressDetails: data.addressDetails,
            profilePic: data.profilePic,
            gstId: data.gstId,
            language: data.language ? data.language.split(";") : [],
            document: data.document ? data.document.split(";") : []
          };
          console.log("Seller Data :", sellerData);

          const existingSeller = await Seller.findOne({ email: sellerData.email });

          if (!existingSeller) {
            const seller = new Seller(sellerData);
            await seller.save();
          }
        })
        .on("end", () => {
          console.log("Users imported successfully!");
        })
        .on("error", (error: any) => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
    }
  }
}
