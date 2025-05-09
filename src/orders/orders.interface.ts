import { Document } from "mongoose";
import { CartItems } from "../carts/carts.interface";
import Users from "../users/users.interface";
import { Address } from "cluster";

interface Orders extends Document {
  items: CartItems;
  taxPrice: number;
  itemsPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
  payment: 'cash' | 'card'
  user: Users;
  address: Address;
}

export default Orders;