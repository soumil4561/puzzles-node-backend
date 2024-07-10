const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTopic = {
    body: Joi.object().keys({
        topicName: Joi.string().required(),
        topicDescription: Joi.string().required(),
        topicCreatorID: Joi.string().custom(objectId)
    }),
    };

const followTopic = {
    params: Joi.object().keys({
        topicID: Joi.string().custom(objectId),
    }),
    body: Joi.object().keys({
        userID: Joi.string().custom(objectId),
    }),
};

const getTopicByName = {
    params: Joi.object().keys({
        topicName: Joi.string().required(),
    }),
};

const getTopicAbout = {
    params: Joi.object().keys({
        topicName: Joi.string(),
    }),
};

const searchTopics = {
    query: Joi.object().keys({
        topicName: Joi.string().required(),
    }),
};

const getTopicByID = {
    params: Joi.object().keys({
        topicID: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createTopic,
    followTopic,
    getTopicByName,
    getTopicAbout,
    searchTopics,
    getTopicByID
};
