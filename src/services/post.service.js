const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Post, User, Topic } = require('../models');


/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */

const createPost = async (postBody) => {
  const post = await Post.create(postBody);
  await Topic.updateOne({ id: postBody.postTopicID }, { $push: { posts: post.id } });
  return post;
};

/**
 * Update a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */

const updatePost = async (userId, postBody) => {
  const post = await Post.findOne({ id: postBody.id });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (post.postCreatorID !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const updatedPost = await Post.updateOne({ id: postBody.id }, postBody);
  return updatedPost;
};

const getPostById = async (postId) => {
  const post = await Post.findOne({
    id: postId,
  });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return post;
};

const handlePostInteraction = async (userId, type, postId) => {
  if (type === 'save') {
    const user = await User.findOne({ postCreatorID: userId });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.savedPosts.includes(postId)) {
      const updatedUser = await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } });
      return updatedUser;
    }
    const updatedUser = await User.updateOne({  _id: userId}, { $push: { savedPosts: postId } });
    return updatedUser;
  }
  if (type === 'like') {
    const post = await Post.findOne({ id: postId });
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    if (post.likes.includes(userId)) {
      const updatedPost = await Post.updateOne({ id: postId }, { $pull: { likes: userId } });
      return updatedPost;
    }
    const updatedPost = await Post.updateOne({ id: postId }, { $push: { likes: userId } });
    return updatedPost;
  }
  if (type === 'dislike') {
    const post = await Post.findOne({ id: postId });
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    const updatedPost = await Post.updateOne({ id: postId }, { $push: { dislikes: userId } });
    return updatedPost;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid type');
};

const deletePost = async (userId, postId) => {
  const post = await Post.findOne({ id: postId });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (post.postCreatorID !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  await Post.deleteOne({ id: postId });
  await Topic.updateOne({ id: post.postTopicID }, { $pull: { posts: postId } });
};

const getPostsbyUser = async (userId, page, limit) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find({ postCreatorID: userId }).skip(skip).limit(limit);
  return posts;
};

module.exports = {
  createPost,
  updatePost,
  getPostById,
  handlePostInteraction,
  deletePost,
  getPostsbyUser,
};
