const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: { type: String },
  date: { type: Date, default: Date.now },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', BlogPostSchema);


