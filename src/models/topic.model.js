const mongoose = require('mongoose');

const { Schema } = mongoose;

const topicSchema = new Schema(
  {
    topicName: {
      type: String,
      required: true,
      unique: true,
    },
    topicDescription: {
      type: String,
      required: true,
    },
    topicFollowers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    topicPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    topicCreatorID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topicImage: {
      type: String,
    },
    topicBanner: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
