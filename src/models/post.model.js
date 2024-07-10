const mongoose = require('mongoose');

const { Schema } = mongoose;

const postSchema = new mongoose.Schema({
  postTitle: {
    type: String,
    required: true,
  },

  postContent: {
    type: String,
    required: true,
  },

  postImageFile: {
    type: String,
    default: '',
    required: false,
  },

  postTopicID: {
    type: Schema.Types.ObjectId,
    ref: 'Topic',
  },

  postCreated: {
    type: Date,
    default: Date.now,
    required: true,
  },

  postCreatorID: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  dislikes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],

  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
