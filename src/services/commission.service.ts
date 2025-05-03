import ProductCommission, { IProductCommission, CommissionStatus } from "../models/commission.model";

export const createCommission = async (commissionData: IProductCommission): Promise<IProductCommission> => {
  try {
    const commission = await ProductCommission.create(commissionData);
    return commission;
  } catch (error) {
    throw new Error("Failed to create commission");
  }
};

export const getAllCommissions = async (): Promise<IProductCommission[]> => {
  try {
    const commissions = await ProductCommission.find();
    return commissions;
  } catch (error) {
    throw new Error("Failed to fetch commissions");
  }
};

export const updateCommission = async (commissionId: string, commissionData: Partial<IProductCommission>): Promise<IProductCommission> => {
  try {
    const updatedCommission = await ProductCommission.findByIdAndUpdate(commissionId, commissionData, { new: true });
    if (!updatedCommission) {
      throw new Error("Commission not found");
    }
    return updatedCommission;
  } catch (error) {
    throw new Error("Failed to update commission");
  }
};

export const deleteCommission = async (commissionId: string): Promise<void> => {
  try {
    const deletedCommission = await ProductCommission.findByIdAndDelete(commissionId);
    if (!deletedCommission) {
      throw new Error("Commission not found");
    }
  } catch (error) {
    throw new Error("Failed to delete commission");
  }
};
