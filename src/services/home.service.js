const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { User, Post, Topic } = require('../models');
const topicService = require('./topic.service');

const getHome = async (userId) => {
  const user = await User.findOne({ _id: userId }, '_id');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const followedTopics = await topicService.getFollowedTopics(userId);

  const posts = await Post.aggregate([
    { $match: { topic: { $in: followedTopics.map((topic) => topic._id) } } },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
  ]);

  if(posts.length<10){
    const morePosts = await Post.aggregate([
      { $match: { topic: { $nin: followedTopics.map((topic) => topic._id) } } },
      { $sort: { createdAt: -1 } },
      { $limit: 10 - posts.length },
    ]);
    posts.push(...morePosts);
  }

  return posts;
};

const getMorePosts = async (userId, page, limit) => {
    const user = await User.findOne({ _id: userId }, '_id');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

    const followedTopics = await topicService.getFollowedTopics(userId);

    const skip = (page - 1) * limit;
    const posts = await Post.aggregate([
        { $match: { topic: { $in: followedTopics.map((topic) => topic._id) } } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
    ]);

    if(posts.length<limit){
        const morePosts = await Post.aggregate([
            { $match: { topic: { $nin: followedTopics.map((topic) => topic._id) } } },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit - posts.length },
        ]);
        posts.push(...morePosts);
    }

    return posts;
}

const getAbout = async (userId) => {
  const user = await User.findOne({ _id: userId }, '_id');
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

    const posts = await Post.find({ postCreatorID: userId }).countDocuments();
    const topics = await Topic.find({ topicCreatorID: userId }).countDocuments();
    const followedTopics = await topicService.getFollowedTopics(userId).length;

    return { posts, topics, followedTopics };
}

module.exports = {
  getHome,
  getMorePosts,
  getAbout,
};
