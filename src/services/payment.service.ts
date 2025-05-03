import PaymentModel, { IPayment, PaymentStatus } from "../models/payment.model";

export class PaymentService {
  public static async createPayment(paymentData: IPayment): Promise<IPayment> {
    try {
      const payment = await PaymentModel.create(paymentData);
      return payment;
    } catch (error) {
      throw new Error("Failed to create payment");
    }
  }

  public static async getAllPayments(): Promise<IPayment[]> {
    try {
      const payments = await PaymentModel.find();
      return payments;
    } catch (error) {
      throw new Error("Failed to fetch payments");
    }
  }

  public static async getPaymentById(paymentId: string): Promise<IPayment | null> {
    try {
      const payment = await PaymentModel.findById(paymentId);
      return payment;
    } catch (error) {
      throw new Error("Failed to fetch payment");
    }
  }

  public static async updatePayment(paymentId: string, paymentData: Partial<IPayment>): Promise<IPayment | null> {
    try {
      const updatedPayment = await PaymentModel.findByIdAndUpdate(paymentId, paymentData, { new: true });
      return updatedPayment;
    } catch (error) {
      throw new Error("Failed to update payment");
    }
  }

  public static async deletePayment(paymentId: string): Promise<void> {
    try {
      const deletedPayment = await PaymentModel.findByIdAndDelete(paymentId);
      if (!deletedPayment) {
        throw new Error("Payment not found");
      }
    } catch (error) {
      throw new Error("Failed to delete payment");
    }
  }
}
