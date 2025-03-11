import mongoose, { Document, Schema, Model } from "mongoose";
import { TransactionCategory } from "./transactions";

export interface IBudget extends Document {
  category:
    | "Food"
    | "Rent"
    | "Entertainment"
    | "Transport"
    | "Housing"
    | "Others";
  limit: number;
  month: number;
  year: number;
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
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

// Create a compound index on category, month, and year to make them a composite key
BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });

const BudgetModel: Model<IBudget> =
  (mongoose.models.Budget as Model<IBudget>) ||
  mongoose.model<IBudget>("Budget", BudgetSchema);

export default BudgetModel;