import { Schema, model, Document, Types, Model } from 'mongoose';
export interface IClothing extends Document {
  name: string;
  image: {
    filename: string;
    url: string;
  };
  description: string;
  category: Types.ObjectId;
  gender: 'men' | 'women' | 'girls' | 'boys';
}

const clothingSchema = new Schema<IClothing>({
    name: { type: String, required: true },
    image: {
        filename: { type: String, required: true },
        url: { type: String, required: true }
    },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    gender: { type: String, enum: ['men', 'women', 'girls', 'boys'], required: true }
});


const Clothing : Model<IClothing> = model<IClothing>('Clothing', clothingSchema);
export default Clothing;
