import { NextFunction, Request, Response } from "express";
import { ContactUsService } from "../../services/contact.service";

export class ContactUsController {
  static async createContactUs(request: Request, response: Response, next: NextFunction): Promise<void> {
    const contactUsData = request.body;
    const contactUsService = new ContactUsService();
    try {
      const newContactUs = await contactUsService.createContactUs(contactUsData);
      response.status(201).json(newContactUs);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getContactUsEntries(request: Request, response: Response, next: NextFunction): Promise<void> {
    const contactUsService = new ContactUsService();
    try {
      const contactUsEntries = await contactUsService.getContactUsEntries();
      response.json(contactUsEntries);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getContactUsEntryById(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const contactUsService = new ContactUsService();
    try {
      const contactUsEntry = await contactUsService.getContactUsEntryById(id);
      response.json(contactUsEntry);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async updateContactUsEntry(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const updatedData = request.body;
    const contactUsService = new ContactUsService();
    try {
      const updatedContactUsEntry = await contactUsService.updateContactUsEntry(id, updatedData);
      response.json(updatedContactUsEntry);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async deleteContactUsEntry(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { id } = request.params;
    const contactUsService = new ContactUsService();
    try {
      await contactUsService.deleteContactUsEntry(id);
      response.json({ message: "Contact us entry deleted successfully" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
