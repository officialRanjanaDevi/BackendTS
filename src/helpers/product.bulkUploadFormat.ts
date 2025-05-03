import Product from "../models/product.model";
import fs from "fs";
import { Readable } from "stream";

export function generateTemplateFileCSV(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const productSchema = Product.schema;

      const headers = [];
      const exampleRow = [];

      for (const path in productSchema.paths) {
        if (path !== "__v" && path !== "_id" && productSchema.paths[path].instance !== "ObjectId") {
          headers.push(path);
          exampleRow.push(await generateExampleValue(productSchema.paths[path]));
        }
      }

      const csvContent = convertToCSV([headers, exampleRow]);

      const filePath = "./template.csv";
      const writeStream = fs.createWriteStream(filePath);
      const readableStream = Readable.from(csvContent);
      readableStream.pipe(writeStream);

      writeStream.on("finish", () => {
        resolve();
      });

      writeStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function convertToCSV(data: any) {
  const csvRows = [];
  for (const row of data) {
    const values = row.map((value: any) => (value ? `"${value}"` : ""));
    csvRows.push(values.join(","));
  }
  return csvRows.join("\n");
}

const generateExampleValue = async (path: any) => {
  const fieldType = path.instance;

  switch (fieldType) {
    case "String":
      return "String";
    case "Number":
      return 0;
    case "Boolean":
      return true;
    case "Date":
      return new Date().toISOString();
    case "ObjectId":
      // Handle any specific logic for ObjectId fields if needed
      return "ObjectId Example";
    default:
      return "Value";
  }
};
