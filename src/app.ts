import express from "express";
import mongoose from "mongoose";
// import { logger } from "./config/logger.config";
import { MainRoute } from "./api/routes/main.routes";
import { SellerRoute } from "./api/routes/seller.routes";
// import { MeetingRoutes } from "./api/routes/meeting.routes";
import { middlewares } from "./middlewares/request.middleware";
import bodyParser from "body-parser";
import methodOverride from "method-override";
import cors from "cors";

import * as dotenv from "dotenv";
import { MessageRoutes } from "./api/routes/message.routes";
dotenv.config({ path: ".env" });

/**
 * *Represents the main application class.
 */
const allowedOrigins = [
  "https://trialshopy.com",
  "https://seller.trialshopy.com",
  "https://www.seller.trialshopy.com",
  "https://admin.trialshopy.com",
  "https://www.admin.trialshopy.com",
  "http://localhost:3000",
  "http://13.202.102.83:5173",
  "http://localhost:5174",
  "http://localhost:5173",
];

export class App {
  public app: express.Application;

  //* Creates a new instance of the application class.

  
  constructor() {
    console.info("Creating app instance");
    this.app = express();
    this.app.use(
      cors({
        origin:allowedOrigins,
        credentials: true,
        methods: ["GET", "POST", "DELETE", "PUT"]
      })
    );
    this.app.use(middlewares);

    // register routes for apis
    this.app.use("/api/v1/seller", SellerRoute.register());
    this.app.use("", MainRoute.register());
    // this.app.use("", MessageRoutes.register(io));
    // this.app.use("", MeetingRoutes.register());

    this.app.use(bodyParser.json());
    this.app.use(methodOverride("_method"));
    this.app.use("/uploads", express.static("uploads"));
  }

  /**
   * *Sets up a connection to the MongoDB database using the provided database name or the
   * *environment variable MONGODB_URI. If neither is provided, a default connection string
   * *is used. Prints a success message if the connection is successful, otherwise logs an
   * *error and exits the process.
   * @param {string} [dbName] - The name of the database to connect to.
   * @returns None
   */
  setupDatabase(dbName?: string) {
    //
    return mongoose
      .connect(dbName ?? process.env.MONGODB_URI ?? "mongodb+srv://nikhilfirst:nikhil123@cluster0.xbhppiu.mongodb.net/Trialshopy")
      .then(() => {
        console.info("Connected to the database");
      })
      .catch((error) => {
        console.error({ error });
        process.exit(1);
      });
  }
}
