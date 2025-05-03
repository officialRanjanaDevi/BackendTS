import { Request } from "express";
import { GridFsStorage } from "multer-gridfs-storage";
import crypto from "crypto";
import path from "path";
import multer, { Multer } from "multer";
import { v2 as cloudinary } from "cloudinary";
import { cloudinaryConfig } from "./../config/cloudinary.config";
import multerStorageCloudinary, { Options } from "multer-storage-cloudinary";

// const mongoURI = process.env.MONGO_URI ?? "mongodb+srv://nikhilfirst:nikhil123@cluster0.xbhppiu.mongodb.net/Trialshopy";

// const storage = new GridFsStorage({
//   url: mongoURI,
//   file: (req: Request, file: Express.Multer.File) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         const filename = buf.toString("hex") + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: "uploads",
//           metadata: {
//             contentType: file.mimetype,
//             size: file.size
//           }
//         };
//         resolve(fileInfo);
//       });
//     });
//   }
// });

cloudinary.config(cloudinaryConfig);

/**
 ** Defines the storage options for uploading files.
 * @param {Options} storageOptions - The storage options object.
 * @property {string} cloudinary - The cloudinary storage provider.
 * @property {object} params - Additional parameters for the storage provider.
 */
const storageOptions: Options = {
  cloudinary: cloudinary,
  params: {}
};
/**
 * *Creates a multer storage engine that uploads files to Cloudinary.
 * @param {object} storageOptions - The options for configuring the storage engine.
 * @returns The multer storage engine configured to upload files to Cloudinary.
 */
const storage = multerStorageCloudinary(storageOptions);

/**
 * *Creates a Multer instance with the specified storage configuration.
 * @param {object} storage - The storage configuration for Multer.
 * @returns {Multer} - The Multer instance.
 */
const upload: Multer = multer({ storage });

export default upload;
