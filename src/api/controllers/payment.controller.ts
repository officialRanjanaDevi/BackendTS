import { Request, Response } from "express";
import PaymentModel, { IPayment, PaymentStatus } from "../../models/payment.model";
import mongoose from "mongoose";

export class PaymentController {
  static createPayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { storeId, totalItems, balance, totalRevenue, status } = req.body;

      const newPayment: IPayment = new PaymentModel({
        storeId,
        totalItems,
        balance,
        totalRevenue,
        status
      });

      const savedPayment = await newPayment.save();
      res.status(201).json(savedPayment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment" });
    }
  };

  static getPayments = async (req: Request, res: Response): Promise<void> => {
    try {
      const payments = await PaymentModel.find();
      res.status(200).json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  };

  static getPaymentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const payment = await PaymentModel.findById(id);

      if (!payment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      res.status(200).json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  };

  static updatePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { storeId, totalItems, balance, totalRevenue, status } = req.body;

      const updatedPayment = await PaymentModel.findByIdAndUpdate(id, { storeId, totalItems, balance, totalRevenue, status }, { new: true });

      if (!updatedPayment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      res.status(200).json(updatedPayment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment" });
    }
  };

  static deletePayment = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const deletedPayment = await PaymentModel.findByIdAndDelete(id);
      if (!deletedPayment) {
        res.status(404).json({ error: "Payment not found" });
        return;
      }

      res.status(200).json({ message: "Payment deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete payment" });
    }
  };
}
