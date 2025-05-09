import mongoose from "mongoose";
import Subcategories from "./subcategories.interface";

const subcategoriesSchema = new mongoose.Schema<Subcategories>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref:'categories' ,required: true},
    img: { type: String },
  },
  {
    timestamps: true,
  }
);

subcategoriesSchema.pre<Subcategories>(/^find/, function (next) {
  this.populate({ path: "category", select: "_id name" });
  next();
});

export default mongoose.model<Subcategories>( "subcategories",subcategoriesSchema);
 
