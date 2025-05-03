import { Document } from "mongoose";

export interface ICategoryDetails extends Document {
  id:string;
  name: string;
  description?: string;
  parent: string | null;
  discount:number;
}