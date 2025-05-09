import mongoose from "mongoose";
import  Orders  from "./orders.interface";

const ordersSchema = new mongoose.Schema<Orders>(
  {
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
        quantity: { type: Number, default: 1 },
        price: Number,
      },
    ],
    payment: { type: String, enum: ["cash", "card"], default: "cash" },
    taxPrice: Number,
    itemsPrice: { type: Number },
    totalPrice: { type: Number },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    address: {
      street: String,
      city: String,
      state: String,
      zip: String,
    },
  },
  { timestamps: true }
);

ordersSchema.pre<Orders>(/^find/, function (next) {
  this.populate({ path: "items.product", select: "name cover" });
  this.populate({ path: "user", select: "name image" });
  next();
});

export default mongoose.model<Orders>("orders", ordersSchema);
