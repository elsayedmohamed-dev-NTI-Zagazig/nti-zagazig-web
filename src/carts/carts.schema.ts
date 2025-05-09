import mongoose from "mongoose";
import Carts from "./carts.interface";

const cartsSchema = new mongoose.Schema<Carts>(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: { type: Number },
      },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    taxPrice: { type: Number },
    totalPrice: { type: Number },
    totalPriceAfterDiscount: { type: Number },
  },
  {
    timestamps: true,
  }
);

cartsSchema.pre<Carts>(/^find/, function (next) {
  this.populate({ path: "items.product", select: "name cover" });
  next();
});


export default mongoose.model<Carts>("carts", cartsSchema);
