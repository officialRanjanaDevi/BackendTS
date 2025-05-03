import { Request, Response } from 'express';
import ProductCommission, { IProductCommission, CommissionStatus } from '../../models/commission.model';
import mongoose from 'mongoose';

export class CommissionController {

  static createCommission = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.params.sellerId;
      const storeId = req.params.storeId;
      const productId = req.params.productId;
      
      const commissionData: any= {
        productId: productId,
        commission: req.body.commission,
        datedFrom: req.body.datedFrom,
        datedTo: req.body.datedTo,
        status: CommissionStatus.ACTIVE // Set the default status here or extract from req.body
      };

      const commission = await ProductCommission.create(commissionData);
      res.status(201).json(commission);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create commission' });
    }
  };

  static getCommissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.params.sellerId;
      const storeId = req.params.storeId;
      const productId = req.params.productId;
      
      // Filter commissions based on sellerId, storeId, and productId (if available)
      const query: any = { sellerId, storeId };
      if (productId) {
        query.productId =  productId ? productId : undefined;
      }
      
      const commissions = await ProductCommission.find(query);
      res.status(200).json(commissions);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch commissions' });
    }
  };

  static updateCommission = async (req: Request, res: Response): Promise<void> => {
    try {
      const sellerId = req.params.sellerId;
      const storeId = req.params.storeId;
      const productId = req.params.productId;
      const commissionId = req.params.id;
      
      const commissionData: Partial<IProductCommission> = req.body;
      
      // Update the commission based on sellerId, storeId, productId, and commissionId
      const updatedCommission = await ProductCommission.findByIdAndUpdate(
        commissionId,
        commissionData,
        { new: true }
      );
      
      res.status(200).json(updatedCommission);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update commission' });
    }
  };

  static deleteCommission = async (req: Request, res: Response): Promise<void> => {
    try {
      const commissionId = req.params.id;
      
      // Delete the commission based on the commissionId
      const deletedCommission = await ProductCommission.findByIdAndDelete(commissionId);
      if (!deletedCommission) {
        res.status(404).json({ message: 'Commission not found' });
        return;
      }
      res.status(200).json({ message: 'Commission deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete commission' });
    }
  }
}
