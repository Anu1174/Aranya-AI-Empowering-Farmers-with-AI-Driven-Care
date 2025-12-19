import mongoose from "mongoose";

const healthLogSchema = new mongoose.Schema({
  date: { type: String, required: true },
  day: { type: Number, required: true },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  temperature: { type: Number, required: true },
  heartRate: { type: Number, required: true },
  activity: { type: Number, default: 0 },
  appetite: { type: Number, default: 0 },
  // ✅ Make oxygen optional at schema level to allow old data
  oxygen: { type: Number, min: 70, max: 100, required: false },
  notes: { type: String, default: "" },
  risk: { type: Number, default: 0 },
});

const animalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  healthLogs: { type: [healthLogSchema], default: [] },
});

export default mongoose.model("Animal", animalSchema);
