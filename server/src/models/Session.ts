import { Document, model, Schema } from "mongoose";

export interface ISession extends Document {
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

let SessionSchema = new Schema<ISession>({
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expiresAt: {
    type: Date,
    default: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    required: true,
  },
});

export let Session = model<ISession>("session", SessionSchema);
