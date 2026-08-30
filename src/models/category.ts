import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: "Couple",
    required: [true, "ID do casal é obrigatório"],
    index: true,
  },
  name: {
    type: String,
    required: [true, "Nome da categoria é obrigatório"],
    trim: true,
  },
  icon: {
    type: String,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.pre("save", function () {
  this.updatedAt = new Date();
});

CategorySchema.index({ coupleId: 1, order: 1 });

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
