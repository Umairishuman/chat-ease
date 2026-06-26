import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  unreadCounts: Map<string, number>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
    unreadCounts: { type: Map, of: Number, default: {} },
  },
  { timestamps: true }
);

ChatSchema.index({ participants: 1 });

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);
