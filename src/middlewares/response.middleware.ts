import { Request, Response, NextFunction } from "express";
import { db } from "./../config/database.config";
// import { logger } from "./../config/logger.config";

export enum RequestStatus {
  processing = "PROCESSING",
  processed = "PROCESSED"
}
export interface ResponseData {
  status: RequestStatus;
  body?: any;
  code?: number;
}

// todo :- loop back discussion
export function updateResponseStatus(_request: Request, response: Response, next: NextFunction) {
  const sendData = response.send;
  const request_id = _request.header("x-requested-with");
  const version = _request.baseUrl.split("/")[2];

  // Seting CORS headers
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', 'https://trialshopy-front-end.netlify.app');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader('Access-Control-Allow-Headers', 'Authorization,Content-Type');

  if (request_id) {
    response.send = function (data): any {
      // const code = response.status
      // logger.info({ code: response.statusCode });
      updateRequestIdResponse(request_id + _request.method + version, data, response.statusCode)
        .then((_) => {
          // logger.info({ message: 'Response Updated Successfully' });
        })
        .catch((error) => console.error({ message: "Unable to update response", error }));
      sendData.apply(response, arguments);
    };
  }
  next();
}

export function updateRequestIdResponse(request_id: string, data: any, code: number): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      const expire: number = parseInt(process.env.RESPONSE_EXPIRE ? process.env.RESPONSE_EXPIRE : "3600");
      const request = await db.get(request_id);
      if (request) {
        const result: ResponseData = JSON.parse(request);
        result.body = data;
        result.code = code;
        result.status = RequestStatus.processed;
        const res = await db.set(request_id, JSON.stringify(result));
        resolve(res);
      }
    } catch (error) {
      reject(error);
    }
  });
}
