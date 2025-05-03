import ContactUs, { IContactUs } from "../models/contact.model";

export class ContactUsService {
  async createContactUs(contactUsData: Partial<IContactUs>) {
    try {
      const newContactUs = await ContactUs.create(contactUsData);
      return newContactUs;
    } catch (error) {
      throw new Error("Error creating contact us entry");
    }
  }

  async getContactUsEntries() {
    try {
      const contactUsEntries = await ContactUs.find().sort({ createdAt: -1 }).exec();
      return contactUsEntries;
    } catch (error) {
      throw new Error("Error fetching contact us entries");
    }
  }

  async getContactUsEntryById(contactUsId: string) {
    try {
      const contactUsEntry = await ContactUs.findById(contactUsId).exec();
      return contactUsEntry;
    } catch (error) {
      throw new Error("Error fetching contact us entry");
    }
  }

  async updateContactUsEntry(contactUsId: string, updatedData: Partial<IContactUs>) {
    try {
      const updatedContactUsEntry = await ContactUs.findByIdAndUpdate(contactUsId, updatedData, { new: true }).exec();
      return updatedContactUsEntry;
    } catch (error) {
      throw new Error("Error updating contact us entry");
    }
  }

  async deleteContactUsEntry(contactUsId: string) {
    try {
      await ContactUs.findByIdAndDelete(contactUsId).exec();
    } catch (error) {
      throw new Error("Error deleting contact us entry");
    }
  }
}
