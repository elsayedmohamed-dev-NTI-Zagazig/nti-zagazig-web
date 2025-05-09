import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Users from "./users.interface";

const usersSchema = new mongoose.Schema<Users>(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "employee", "user"],
      default: "user",
    },
    active: { type: Boolean, default: true },
    googleId: { type: String },
    hasPassword: { type: Boolean, default: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
    address: [{
      address: String,
      city: String,
      state: String,
      zip: String,
  }],
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetCodeVerify: Boolean,
    image: { type: String, default: "user-default.png" },
  },
  { timestamps: true }
);

//  image users
const imagesUrl = (document: Users) => {
  if (document.image && document.image.startsWith("user"))
    document.image = `${process.env.BASE_URL}/images/users/${document.image}`;
};
usersSchema.post("init", imagesUrl).post("save", imagesUrl);

// bcrypt Password   await save document database
usersSchema.pre<Users>("save", async function (next) {
  // this => document  , isModified = Edit => (Password)   salt=13
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 13);
  next();
});

export default mongoose.model<Users>("users", usersSchema);
