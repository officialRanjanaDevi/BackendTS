import { NextFunction, Request, Response } from "express";
import { MongoClient, GridFSBucket } from "mongodb";

export class DownloadController {
  
  static async downloadImage(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const mongoURI = process.env.MONGO_URI ?? "mongodb+srv://nikhilfirst:nikhil123@cluster0.xbhppiu.mongodb.net/Trialshopy";
      const client = await MongoClient.connect(mongoURI);
      const db = client.db();
      const bucket = new GridFSBucket(db, {
        bucketName: "uploads"
      });

      const filename = request.params.name;
      const downloadStream = bucket.openDownloadStreamByName(filename);

      downloadStream.on("error", (err) => {
        client.close(); 
        response.status(404).json({ message: "Cannot download the Image!", error: err });
      });

      response.setHeader("Content-Type", "image/png");
      downloadStream.pipe(response);

      downloadStream.on("end", () => {
        client.close();
        response.end();
      });
    } catch (err) {
      const e: any = err ?? new Error(null);
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
}
