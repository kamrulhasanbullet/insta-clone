import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISaved extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedSchema = new Schema<ISaved>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  },
  { timestamps: true },
);

SavedSchema.index({ user: 1, post: 1 }, { unique: true });
SavedSchema.index({ user: 1, createdAt: -1 });

const Saved: Model<ISaved> =
  mongoose.models.Saved || mongoose.model<ISaved>("Saved", SavedSchema);

export default Saved;
