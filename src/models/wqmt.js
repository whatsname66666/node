import mongoose from 'mongoose';

const wqmtSchema = new mongoose.Schema({
  id: Number,
  music_album_id: Number,
  title: String,
  url: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('wqmtMusics', wqmtSchema,'wqmtMusics');