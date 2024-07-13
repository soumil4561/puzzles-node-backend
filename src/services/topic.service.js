const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const Topic = require('../models/topic.model');

const createTopic = async (topicBody) => {
  const topic = await Topic.create(topicBody);
  return topic;
};

const followTopic = async (topicID, userID) => {
  const topic = await Topic.findOne({ _id: topicID });
  if (!topic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
  }
  if (topic.topicFollowers.includes(userID)) {
    // pull the user from the followers array
    await topic.updateOne({ $pull: { topicFollowers: userID } });
  } else {
    // push the user to the followers array
    await topic.updateOne({ $push: { topicFollowers: userID } });
  }
};

const getFollowedTopics = async (userID) => {
    const topics = await Topic.find({ topicFollowers: userID });
    return topics;
}

const getTopicByName = async (name) => {
    const topic = await Topic.findOne({ topicName: name }).populate('topicPosts')
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    return topic;
}

const getTopicAbout = async (name) => {
    const topic = await Topic.findOne({ topicName: name });
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    return {
        topicName: topic.topicName,
        topicDescription: topic.topicDescription,
        topicFollowers: topic.topicFollowers.length,
        topicPosts: topic.topicPosts.length,
        topicCreated: topic.createdAt
    };
}

const getAllTopics = async () => {
    const topics = await Topic.find();
    return topics;
}

const searchTopic = async (name) => {
    const topics = await Topic.find({ topicName: { $regex: name, $options: 'i' } });
    return topics;
}

const getTopicByID = async (topicID) => {
    const topic = await Topic.findById(topicID);
    if (!topic) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
    }
    return topic;
}

module.exports = {
    createTopic,
    followTopic,
    getFollowedTopics,
    getTopicByName,
    getTopicAbout,
    getAllTopics,
    searchTopic,
    getTopicByID
};
