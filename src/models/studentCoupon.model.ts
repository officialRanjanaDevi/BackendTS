import { Model, model, Schema, Document } from "mongoose";

export interface ISchool extends Document {
   couponType:String,
   schoolId:Object,
   userId:Schema.Types.ObjectId;
}

const schoolSchema: Schema = new Schema({
    couponType:{
        enum:["school"],
        type:String,
        default:"school"
    },
    schoolId: {
        filename: { type: String, required: true },
        url: { type: String, required: true }
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }
});

const SchoolCoupon: Model<ISchool> = model<ISchool>("SchoolCoupon", schoolSchema);

export default SchoolCoupon;
