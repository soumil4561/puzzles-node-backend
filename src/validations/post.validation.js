const Joi = require('joi');

const createPost = {
  body: {
    postTitle: Joi.string().required(),
    postContent: Joi.string().required(),
    postImageFile: Joi.any().optional(),
    postTopicID: Joi.string().required(),
    postCreatorID: Joi.string().required(),
  },
};

const updatePost = {
  body: {
    postTitle: Joi.string().optional(),
    postContent: Joi.string().optional(),
    postImageFile: Joi.any().optional(),
  },
};

const getPostById = {
  params: {
    postId: Joi.string().required(),
  },
};

const handlePostInteraction = {
  body: {
    type: Joi.string().required(),
    postId: Joi.string().required(),
  },
};

const deletePost = {
  body: {
    postId: Joi.string().required(),
  },
};

const getPosts = {
  params: {
    page: Joi.number().required(),
    limit: Joi.number().required(),
  },
};

module.exports = {
  createPost,
  updatePost,
  getPostById,
  handlePostInteraction,
  deletePost,
  getPosts,
};
