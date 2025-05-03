import OfferModel, { Offer } from "../models/offer.model";

export class OfferService {
  // Create a new offer.
  static async createOffer(offerData: Offer): Promise<Offer> {
    try {
      const createdOffer = await OfferModel.create(offerData);
      return createdOffer;
    } catch (error) {
      throw new Error(`Error creating offer: ${error.message}`);
    }
  }

  // Get all offers
  static async getAllOffers(): Promise<Array<Offer>> {
    try {
      const offers = await OfferModel.find().populate("applicableProducts");
      return offers;
    } catch (error) {
      throw new Error(`Error getting offers: ${error.message}`);
    }
  }


}
