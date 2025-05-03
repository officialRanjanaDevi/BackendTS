import { NextFunction, Request, Response } from "express";
import { ArrivalService } from "../../services/arrival.service";

export class ArrivalController {

  static async getOne(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const arrival = await new ArrivalService().getArrival(request.params.id);
      response.status(200).json(arrival);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }

  static async getAll(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const arrivals = await new ArrivalService().getAllArrivals();
      response.status(200).json(arrivals);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  static async getAllByCategory(request: Request, response: Response, next: NextFunction): Promise<void> {
    try {
      const {categoryId}=request.params
      console.log(categoryId)
      const arrivals = await new ArrivalService().getAllByCategoryArrivals(categoryId);
      response.status(200).json(arrivals);
    } catch (err) {
      const error = JSON.parse(err.message);
      next({ code: error.code, message: error.message, error: error.error });
    }
  }
  // static async update(request: Request, response: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const result = await new ArrivalService().updateArrival(request.params.id, request.body);
  //     response.status(201).json(result);
  //   } catch (err) {
  //     const error = JSON.parse(err.message);
  //     next({ code: error.code, message: error.message, error: error.error });
  //   }
  // }

  // static async delete(request: Request, response: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const result = await new ArrivalService().deleteArrival(request.params.id);
  //     response.status(200).json({ message: "Arrival deleted successfully", data: result });
  //   } catch (err) {
  //     const error = JSON.parse(err.message);
  //     next({ code: error.code, message: error.message, error: error.error });
  //   }
  // }
}
