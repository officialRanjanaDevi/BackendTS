// import * as rax from "retry-axios";
// // const rax = require("retry-axios");
// // import { logger } from "./../config/logger.config";
// export const raxConfig: rax.RetryConfig = {
//   // Retry 3 times on requests that return a response (500, etc) before giving up.  Defaults to 3.
//   retry: 0, //parseInt(process.env.AXIOS_NUMBER_OF_RETRIES ? process.env.AXIOS_NUMBER_OF_RETRIES : '3', 10),
//   // Retry twice on errors that don't return a response (ENOTFOUND, ETIMEDOUT, etc).
//   noResponseRetries: parseInt(process.env.AXIOS_NUMBER_OF_NO_RESPONSE_RETRY ? process.env.AXIOS_NUMBER_OF_NO_RESPONSE_RETRY : "2", 10),
//   // Milliseconds to delay at first.  Defaults to 100.
//   retryDelay: parseInt(process.env.AXIOS_RETRY_DELAY ? process.env.AXIOS_RETRY_DELAY : "3000"),
//   // HTTP methods to automatically retry.  Defaults to:
//   // ['GET', 'HEAD', 'OPTIONS', 'DELETE', 'PUT']
//   httpMethodsToRetry: ["GET", "HEAD", "OPTIONS", "DELETE", "PUT", "POST"],
//   // The response status codes to retry.  Supports a double
//   // array with a list of ranges.  Defaults to:
//   // [[100, 199], [429, 429], [500, 599]]
//   statusCodesToRetry: [
//     [100, 199],
//     [429, 429],
//     [500, 599]
//   ],
//   // You can set the backoff type.
//   // options are 'exponential' (default), 'static' or 'linear'
//   backoffType: "exponential",
//   // You can detect when a retry is happening, and figure out how many
//   // retry attempts have been made
//   onRetryAttempt: (err) => {
//     const cfg = rax.getConfig(err);
//     if (cfg) console.error({ message: `Retry attempt #${cfg.currentRetryAttempt}`, err });
//   }
// };
