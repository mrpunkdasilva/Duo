import mongoose, { Schema, Document } from "mongoose";

export interface ICoupleRating {
  romancio?: number;
  diversao?: number;
  emocao?: number;
  recomendaria?: number;
}

export type WatchStatus = "not_watched" | "watching" | "watched" | "to_watch";

export interface IWatchStatus {
  userId: mongoose.Types.ObjectId;
  status: WatchStatus;
}

export interface IMovie extends Document {
  _id: mongoose.Types.ObjectId;
  coupleId: mongoose.Types.ObjectId;
  addedBy: mongoose.Types.ObjectId;
  tmdbId: number;
  mediaType: "movie" | "tv";
  title: string;
  name?: string;
  overview: string;
  posterPath?: string;
  backdropPath?: string;
  releaseDate?: string;
  firstAirDate?: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  tagline?: string;
  runtime?: number;
  numberOfSeasons?: number;
  numberOfEpisodes?: number;
  status?: string;
  coupleRating?: ICoupleRating;
  favoritedBy?: mongoose.Types.ObjectId[];
  watchStatuses?: IWatchStatus[];
  createdAt: Date;
  updatedAt: Date;
}

const MovieSchema = new Schema<IMovie>({
  coupleId: {
    type: Schema.Types.ObjectId,
    ref: "Couple",
    required: [true, "ID do casal é obrigatório"],
    index: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "ID do usuário que adicionou é obrigatório"],
  },
  tmdbId: {
    type: Number,
    required: [true, "ID do TMDB é obrigatório"],
  },
  mediaType: {
    type: String,
    enum: ["movie", "tv"],
    required: [true, "Tipo de mídia é obrigatório"],
  },
  title: {
    type: String,
    required: [true, "Título é obrigatório"],
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  overview: {
    type: String,
    default: "",
  },
  posterPath: {
    type: String,
  },
  backdropPath: {
    type: String,
  },
  releaseDate: {
    type: String,
  },
  firstAirDate: {
    type: String,
  },
  voteAverage: {
    type: Number,
    default: 0,
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  genreIds: [{
    type: Number,
  }],
  popularity: {
    type: Number,
    default: 0,
  },
  tagline: {
    type: String,
  },
  runtime: {
    type: Number,
  },
  numberOfSeasons: {
    type: Number,
  },
  numberOfEpisodes: {
    type: Number,
  },
  status: {
    type: String,
  },
  coupleRating: {
    romancio: { type: Number, min: 1, max: 5 },
    diversao: { type: Number, min: 1, max: 5 },
    emocao: { type: Number, min: 1, max: 5 },
    recomendaria: { type: Number, min: 1, max: 5 },
  },
  favoritedBy: [{
    type: Schema.Types.ObjectId,
    ref: "User",
  }],
  watchStatuses: [{
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["not_watched", "watching", "watched", "to_watch"] },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

MovieSchema.pre("save", function () {
  this.updatedAt = new Date();
});

MovieSchema.index({ coupleId: 1, tmdbId: 1 }, { unique: true });
MovieSchema.index({ coupleId: 1, mediaType: 1 });
MovieSchema.index({ coupleId: 1, createdAt: -1 });

export default mongoose.models.Movie || mongoose.model<IMovie>("Movie", MovieSchema);
