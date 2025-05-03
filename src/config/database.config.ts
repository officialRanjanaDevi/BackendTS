import Redis from "ioredis";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// export const db = new Redis({
//   host: process.env.REDIS_HOST ?? "127.0.0.1",
//   db: parseInt((process.env.REDIS_DB ?? "0") as string),
//   port: parseInt((process.env.REDIS_PORT ?? "6379") as string)
// });

export const db = new Redis(process.env.REDIS_URL ?? "rediss://red-cjvd6u95mpss7383qtn0:YRBVk5JTHwjc3rxgGhFzyHfd0h4vSJ8I@oregon-redis.render.com:6379");
