import mongoose, { Schema, Document } from "mongoose";

export type PlaceCategory =
  | "restaurante"
  | "praia"
  | "museu"
  | "parque"
  | "cafeteria"
  | "bar"
  | "loja"
  | "outro";

export interface IPlace extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: PlaceCategory;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  visited: boolean;
  rating?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PlaceSchema = new Schema<IPlace>({
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: "Couple",
    required: [true, "ID do casal é obrigatório"],
    index: true,
  },
  name: {
    type: String,
    required: [true, "Nome do lugar é obrigatório"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ["restaurante", "praia", "museu", "parque", "cafeteria", "bar", "loja", "outro"],
      message: "Categoria inválida",
    },
    default: "outro",
  },
  address: {
    type: String,
    trim: true,
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90,
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180,
  },
  photoUrl: {
    type: String,
  },
  visited: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: [1, "Rating mínimo é 1"],
    max: [5, "Rating máximo é 5"],
  },
  notes: {
    type: String,
    trim: true,
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

PlaceSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

PlaceSchema.index({ coupleId: 1, visited: 1 });
PlaceSchema.index({ coupleId: 1, category: 1 });

export default mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);
