import Faq, { IFaq } from "../models/faq.model";

export class FaqService {

    // Create a new FAQ
    async createFaq(faqData: any): Promise<IFaq> { 
        try {
            const existingFaq = await Faq.findOne({ question: faqData.question }).exec();
            if (existingFaq) {
              throw new Error("FAQ already exists");
            }
            else{
          const newFaq = await Faq.create(faqData);
          return newFaq;
            }
        } catch (error) {
          throw new Error("Error creating FAQ");
        }
      }

      // Get all FAQs
        async getAllFaq(): Promise<IFaq[]> {       
            try {
            const faqs = await Faq.find().exec();
            return faqs;
            } catch (error) {
            throw new Error("Error getting all FAQ");
            }
        }
    }




