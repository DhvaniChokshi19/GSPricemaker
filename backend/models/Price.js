import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
  date: {
    type: String, // YYYY-MM-DD
    required: true,
  },
  time: {
    type: String, // hh:mm A
    required: true,
  },
  gold24k: {
    type: Number,
    required: true,
  },
  gold22k: {
    type: Number,
    required: true,
  },
  gold20k: {
    type: Number,
    required: true,
  },
  silver: {
    type: Number,
    required: true,
  },
  note: {
    type: String,
    default: '',
  }
}, {
  timestamps: true
});

priceSchema.index({ createdAt: -1 });

export const Price = mongoose.model('Price', priceSchema);
export default Price;
