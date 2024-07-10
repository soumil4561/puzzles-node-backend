const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { topicService, mediaService } = require('../services');

const createTopic = catchAsync(async (req, res) => {
    if(req.files){
        const topicImage = await mediaService.uploadMedia(req.files[0]);
        req.body.topicImage = topicImage;
        const topicBanner = await mediaService.uploadMedia(req.files[1]);
        req.body.topicBanner = topicBanner;
    }
    const topic = await topicService.createTopic(req.body);
    res.status(httpStatus.CREATED).send(topic);
    }
);

const followTopic = catchAsync(async (req, res) => {
    await topicService.followTopic(req.params.topicID, req.user.id);
    res.status(httpStatus.OK).send();
    }
);

const getFollowedTopics = catchAsync(async (req, res) => {
    const topics = await topicService.getFollowedTopics(req.user.id);
    res.status(httpStatus.OK).send(topics);
    }
);

const getTopicByName = catchAsync(async (req, res) => {
    const topic = await topicService.getTopicByName(req.params.topicName);
    res.status(httpStatus.OK).send(topic);
    }
);

const getTopicAbout = catchAsync(async (req, res) => {
    const topic = await topicService.getTopicByName(req.params.topicName);
    res.status(httpStatus.OK).send({
        topicName: topic.topicName,
        topicDescription: topic.topicDescription,
        topicFollowers: topic.topicFollowers.length,
        topicPosts: topic.topicPosts.length,
        topicCreated: topic.topicCreated
    });
    }
);

const getAllTopics = catchAsync(async (req, res) => {
    const topics = await topicService.getAllTopics();
    res.status(httpStatus.OK).send(topics);
    }
);

const searchTopic = catchAsync(async (req, res) => {
    const topics = await topicService.searchTopic(req.query.topicName);
    res.status(httpStatus.OK).send(topics);
    }
);

const getTopicByID = catchAsync(async (req, res) => {
    const topic = await topicService.getTopicByID(req.params.topicID);
    res.status(httpStatus.OK).send(topic);
    }
);

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
