import express from "express";
import * as http from "http";
import { App } from "./app";
import { CronJobService } from "./services/cronjob.service";
// import { createSocketServer } from "./socket/socketServer";
import { Server } from "socket.io";

// import { logger } from "./config/logger.config";
import * as dotenv from "dotenv";
import { initializeSocket } from "./socket/socket";
import { MessageRoutes } from "./api/routes/message.routes";
dotenv.config({ path: ".env" });

const appInstance: App = new App();

// Setting up the port for the server
const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 7000;
// Firing up the server
appInstance
  .setupDatabase()
  /**
   * *Starts the server and listens for incoming requests on the specified port.
   * *Initializes a cron job service to run scheduled tasks.
   * @param {number} port - The port number to listen on.
   * @returns None
   */
  .then((_) => {
    const app: express.Application = appInstance.app;

    // const server = http.createServer(app);
    // createSocketServer(server);
    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: [
          "https://seller.trialshopy.com",
          "https://www.seller.trialshopy.com",
          "https://admin.trialshopy.com",
          "https://www.admin.trialshopy.com",
          "https://trialshopy.com",
          "http://localhost:3000",
          "http://13.202.102.83:5173",
          "http://localhost:5174",
          "http://localhost:5173",
          process.env.Frontend_Endpoint
        ],
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
        credentials: true
      }
    });
    app.get("/", (req, res) => {
      res.status(200).json({ message: "Trailshopy Backend!" });
    });
    initializeSocket(io);
    app.use("", MessageRoutes.register(io));
    server.listen(port, async () => {
      //setup cron job service
      const cronJobService = new CronJobService();
      cronJobService.cronJob();

      console.info("Server is running ❤️  at", `http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error({ error });
    process.exit(1);
  });
