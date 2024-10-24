// models/History.ts
import { Schema, model, models } from "mongoose";

export interface IHistory {
  userId: string; // Reference to the user performing the search
  searchTerm: string; // The search term the user entered
  timestamp: Date; // When the search was performed
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: String, required: true },
    searchTerm: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { toJSON: { versionKey: false } }
);

const History = models.History || model<IHistory>("History", HistorySchema);
export default History;
