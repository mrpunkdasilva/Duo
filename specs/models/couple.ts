import mongoose, { Schema, Document } from "mongoose";

export interface ICouple extends Document {
  _id: mongoose.Types.ObjectId;
  inviteCode: string;
  users: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const CoupleSchema = new Schema<ICouple>({
  inviteCode: {
    type: String,
    required: [true, "Código de convite é obrigatório"],
    unique: true,
    length: 6,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      validate: {
        validator: function (v: mongoose.Types.ObjectId[]) {
          return v.length <= 2;
        },
        message: "Um casal pode ter no máximo 2 pessoas",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Couple || mongoose.model<ICouple>("Couple", CoupleSchema);
