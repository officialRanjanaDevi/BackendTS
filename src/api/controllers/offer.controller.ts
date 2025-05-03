import { NextFunction, Request, Response } from "express";
import { OfferService } from "../../services/offer.service";
import { Offer } from "../../models/offer.model";

export class OfferController {
  // Create a new offer.
  static async createOffer(req: Request, res: Response): Promise<void> {
    try {
      const offerData: Offer = req.body;
      const createdOffer = await OfferService.createOffer(offerData);
      res.status(201).json(createdOffer);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get all offers
  static async getAllOffers(req: Request, res: Response): Promise<void> {
    try {
      const offers = await OfferService.getAllOffers();
      res.status(200).json(offers);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


}
