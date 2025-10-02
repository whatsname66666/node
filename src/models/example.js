import mongoose from 'mongoose';

const exampleSchema = new mongoose.Schema({
  id: String,
  is_playable: Boolean,
  title: String,
  url: String,
  score: String,
  is_watched: Boolean,
  cover_url: Boolean,
  release_date: Boolean,
  actor_count: Number,
  types: Array,
  rating: Array,
  regions: Array,
  actors: Array,
  vote_count: Number,
  release_date: Date,
  rank: Number,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('movies', exampleSchema,'movies');