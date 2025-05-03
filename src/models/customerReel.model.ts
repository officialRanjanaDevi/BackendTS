import { Schema, model, Model, Document, Types } from "mongoose";

interface ILikeDislike {
  userId: Types.ObjectId;
}

interface IComment {
  userId: Types.ObjectId;
  comment: string;
}

interface ICustomerReel extends Document {
  customerId: Types.ObjectId;
  video: string;
  caption: string;
  type: string;
  likes: ILikeDislike[];
  dislikes: ILikeDislike[];
  comments: IComment[];
  shares: number;
}

const customerReelSchema = new Schema<ICustomerReel>({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  video: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    default: "customer",
  },
  likes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  dislikes: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  comments: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  shares: {
    type: Number,
    required: true,
    default: 0,
  },
});

const CustomerReel: Model<ICustomerReel> = model<ICustomerReel>(
  "CustomerReel",
  customerReelSchema
);

export default CustomerReel;
