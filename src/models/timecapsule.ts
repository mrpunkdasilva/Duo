import mongoose, { Schema, Document } from "mongoose";

export interface ITimeCapsule extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  photo?: string;
  createdAt: Date;
  openAt: Date;
  openedAt?: Date;
  isOpened: boolean;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
}

const TimeCapsuleSchema = new Schema<ITimeCapsule>({
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: "Couple",
    required: [true, "ID do casal é obrigatório"],
    index: true,
  },
  title: {
    type: String,
    required: [true, "Título é obrigatório"],
    trim: true,
    maxlength: [100, "Título deve ter no máximo 100 caracteres"],
  },
  message: {
    type: String,
    required: [true, "Mensagem é obrigatória"],
    trim: true,
    maxlength: [500, "Mensagem deve ter no máximo 500 caracteres"],
  },
  photo: {
    type: String,
  },
  openAt: {
    type: Date,
    required: [true, "Data de abertura é obrigatória"],
  },
  openedAt: {
    type: Date,
  },
  isOpened: {
    type: Boolean,
    default: false,
  },
  senderId: {
    type: String,
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  recipientId: {
    type: String,
    required: true,
  },
  recipientName: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

TimeCapsuleSchema.index({ coupleId: 1, isOpened: 1 });
TimeCapsuleSchema.index({ coupleId: 1, openAt: 1 });

export default mongoose.models.TimeCapsule || mongoose.model<ITimeCapsule>("TimeCapsule", TimeCapsuleSchema);
