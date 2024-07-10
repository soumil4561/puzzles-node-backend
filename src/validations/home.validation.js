const Joi = require('joi');

const getMorePosts = {
  body: Joi.object().keys({
    page: Joi.number().integer().min(1).required(),
    limit: Joi.number().integer().min(1).required(),
  }),
};

module.exports = {
  getMorePosts,
};
