const mongoose = require('mongoose');

const { Schema } = mongoose;

const commentSchema = new Schema(
  {
    commentContent: {
      type: String,
      required: true,
    },
    commentCreatorID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentPost: {
      type: Schema.Types.ObjectId,
      ref: 'Post',
      required: true,
    },
    commentLikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    commentDislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
