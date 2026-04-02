import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStory extends Document {
  _id: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  imageUrl: string;
  imagePublicId: string;
  caption: string;
  viewers: mongoose.Types.ObjectId[];
  viewersCount: number;
  expiresAt: Date;
  createdAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    caption: { type: String, default: "", maxlength: 200 },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    viewersCount: { type: Number, default: 0 },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: { expires: 0 }, 
    },
  },
  { timestamps: true },
);

StorySchema.index({ author: 1, createdAt: -1 });
StorySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Story: Model<IStory> =
  mongoose.models.Story || mongoose.model<IStory>("Story", StorySchema);

export default Story;
