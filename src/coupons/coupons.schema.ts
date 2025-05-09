import mongoose from "mongoose";
import Coupons from "./coupons.interface";

const couponsSchema = new mongoose.Schema<Coupons>(
  {
    name: { type: String },
    discount: { type: Number },
    limit: { type: Number },
    expireTime: { type: Date },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<Coupons>("coupons", couponsSchema);
