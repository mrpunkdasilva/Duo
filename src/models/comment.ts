import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  _id: mongoose.Types.ObjectId;
  placeId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  text: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  placeId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: [true, "ID do lugar é obrigatório"],
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ID do usuário é obrigatório"],
  },
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: "Couple",
    required: [true, "ID do casal é obrigatório"],
    index: true,
  },
  text: {
    type: String,
    required: [true, "Texto do comentário é obrigatório"],
    trim: true,
    maxlength: [500, "Comentário deve ter no máximo 500 caracteres"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.index({ placeId: 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", CommentSchema);
