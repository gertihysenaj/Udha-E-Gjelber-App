const mongoose = require('mongoose');

const CommunityPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true }, 
  date: { type: Date, default: Date.now },
});

const CommunityPost = mongoose.model('CommunityPost', CommunityPostSchema);
module.exports = CommunityPost;
