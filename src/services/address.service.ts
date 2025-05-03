import { IAddress, IAddressUpdate } from "../interfaces/address.interface";
import Address, { refType } from "../models/address.model";
import { addressType } from "../models/address.model";

/**
 * *Service class for managing addresses.
 */
export class AddressService {
  /**
   * *Creates a new address record in the database.
   * @param {IAddress} data - The data object containing the address information.
   * @param {string} [language] - The language code for the address.
   * @returns {Promise<Address>} A promise that resolves to the saved address record.
   */
  async createAddress(data: IAddress, language?: string) {
    // Create a new address
    const address = new Address(data);
    // Save the address
    return address.save();
  }

  /**
   ** Retrieves a list of addresses from the database.
   * @param {number} limit - The maximum number of addresses to retrieve.
   * @param {number} page - The page number of addresses to retrieve.
   * @param {string} [language] - The language of the addresses to retrieve. (optional)
   * @returns {Promise<Address[]>} - A promise that resolves to an array of addresses.
   */
  async getAllAddress(limit: number, page: number, language?: string) {
    // Retrieve all addresses from the database with pagination
    const addresses = await Address.find()
      .limit(limit)
      .skip(page * limit)
      .lean()
      .exec();
    // Return the addresses
    return addresses;
  }

  /**
   ** Retrieves addresses based on the provided reference ID and address type.
   * @param {string} refId - The reference ID to search for.
   * @param {addressType} type - The type of address to retrieve.
   * @param {string} [language] - Optional language parameter to filter addresses by language.
   * @returns {Promise<Address[]>} - A promise that resolves to an array of addresses matching the criteria.
   */
  async getAddress(refId: string, type: refType, language?: string) {
    // Retrieve addresses based on the provided reference ID and address type
    const addresses = await Address.find({ for: type, refId: refId, status: "active" }).exec();
    // Return the addresses
    return addresses;
  }

  /**
   * *Updates an address with the given ID using the provided updated data.
   * @param {string} addressId - The ID of the address to update.
   * @param {any} updatedData - The updated data to apply to the address.
   * @param {string} language - The language to use for error messages.
   * @returns {Promise<any>} - A promise that resolves to the updated address.
   * @throws {Error} - If the address is not found or an error occurs during the update.
   */
  async updateOneAddress(addressId: string, updatedData: any, language: string): Promise<any> {
    try {
      // Find the address by ID and update
      const result = await Address.findOneAndUpdate({ _id: addressId }, updatedData, { new: true }).exec();
      return result;
    } catch (error) {
      // Handle any errors
      console.error("Error in updateOneAddress:", error);
      throw new Error(`Error updating address: ${error.message}`);
    }
  }

  /**
   * *Deletes an address with the specified addressId and updates its status to "inactive".
   * @param {string} addressId - The ID of the address to delete.
   * @param {string} [language] - The language to use for the operation.
   * @returns {Promise<Address>} A promise that resolves to the updated address object.
   */
  async deleteAddress(addressId: string, language?: string) {
    // Set the status of the address to "inactive"
    const result = await Address.findOneAndUpdate({ _id: addressId }, { $set: { status: "inactive" } }, { new: true }).exec();
    // Return the result
    return result;
  }

  /**
   * *Revoke an address by its ID.
   * @param {string} addressId - The ID of the address to revoke.
   * @param {string} [language] - The language to use for error messages (optional).
   * @returns {Promise} A promise that resolves to the removed address.
   */
  async revokeAddress(addressId: string, language?: string) {
    // Remove the address from the database and return the removed address
    return await Address.findByIdAndRemove({ _id: addressId }).exec();
  }
}
