const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createComment = {
    body: Joi.object().keys({
        commentContent: Joi.string().required(),
        commentPost: Joi.string().required(),
    }),
};

const likeComment = {
    params: Joi.object().keys({
        commentID: Joi.string().custom(objectId),
    }),
};

const dislikeComment = {
    params: Joi.object().keys({
        commentID: Joi.string().custom(objectId),
    }),
};

const deleteComment = {
    params: Joi.object().keys({
        commentID: Joi.string().custom(objectId),
    }),
};

module.exports = {
    createComment,
    likeComment,
    dislikeComment,
    deleteComment,
};