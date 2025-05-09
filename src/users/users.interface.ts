import { Document, Schema } from "mongoose";

interface Users extends Document {
  readonly username: string;
  readonly name: string;
  readonly email: string;
  password: string; // not readonly => Edit
  readonly role: Role;
  readonly active: boolean;
  googleId: string;
  hasPassword: boolean;
  wishlist: Schema.Types.ObjectId[];
  address: Address[];
  passwordChangedAt: Date | number;
  passwordResetCode: string | undefined;
  passwordResetCodeExpires: Date | number | undefined;
  passwordResetCodeVerify: boolean | undefined;
  image: string;
}

type Role = "admin" | "employee" | "user";


export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}


export default Users;
