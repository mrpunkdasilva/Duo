import mongoose, { Schema, Document } from "mongoose";

export interface IPlaceRating {
  ambiente?: number;
  romance?: number;
  custo?: number;
  experiencia?: number;
}

export interface IPlace extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  category: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  photoUrl?: string;
  visited: boolean;
  rating?: IPlaceRating;
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
    enum: ["restaurante", "praia", "museu", "parque", "cafeteria", "bar", "loja"],
    default: "restaurante",
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
    ambiente: { type: Number, min: 1, max: 5 },
    romance: { type: Number, min: 1, max: 5 },
    custo: { type: Number, min: 1, max: 5 },
    experiencia: { type: Number, min: 1, max: 5 },
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

PlaceSchema.pre("save", function () {
  this.updatedAt = new Date();
});

PlaceSchema.index({ coupleId: 1, visited: 1 });
PlaceSchema.index({ coupleId: 1, category: 1 });

export default mongoose.models.Place || mongoose.model<IPlace>("Place", PlaceSchema);
