import mongoose, { Document, Schema, Model } from "mongoose";
import { TransactionCategory } from "./transactions";

export interface IBudget extends Document {
  category: "Food" | "Rent" | "Entertainment" | "Others";
  limit: number;
}

const BudgetSchema = new Schema<IBudget>(
  {
    category: {
      type: String,
      enum: Object.values(TransactionCategory),
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

BudgetSchema.index({ category: 1 }, { unique: true });

const BudgetModel: Model<IBudget> =
  (mongoose.models.Budget as Model<IBudget>) ||
  mongoose.model<IBudget>("Budget", BudgetSchema);

export default BudgetModel;
