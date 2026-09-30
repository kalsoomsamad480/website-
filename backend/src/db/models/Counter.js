import mongoose from 'mongoose';

// Atomic sequence numbers (e.g. order numbers SM-1009, SM-1010...)
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

export async function nextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true },
  );
  return counter.seq;
}

export default Counter;
