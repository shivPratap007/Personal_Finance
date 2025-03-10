import mongoose, { Document, Schema, Model } from "mongoose";

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  description: string;
  category:
    | "Food"
    | "Rent"
    | "Entertainment"
    | "Transport"
    | "Housing"
    | "Others";
}

export enum TransactionCategory {
  Food = "Food",
  Rent = "Rent",
  Entertainment = "Entertainment",
  Transport = "Transport",
  Housing = "Housing",
  Others = "Others",
}

const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: Object.values(TransactionCategory),
      default: TransactionCategory.Others,
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel: Model<ITransaction> =
  (mongoose.models.Transaction as Model<ITransaction>) ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionModel;
