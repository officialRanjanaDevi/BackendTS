import { Document } from 'mongoose';

export interface Iorder extends Document{
    userId:string;
    products:{
        product: string;
        quantity: number;
    }[];
    totalPrice: number;
    shippingAddress: string;
    orderDate: Date;
    status: 'pending'| 'processing'| 'shipped'| 'delivered';
}

export interface IorderUpdate extends Document{
    orderDate: Date;
    status: 'pending'| 'processing'| 'shipped'| 'delivered';
}