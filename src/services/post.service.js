const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { Post, User, Topic, Comment } = require('../models');

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */

const createPost = async (postBody) => {
  const post = await Post.create(postBody);
  await Topic.updateOne({ _id: postBody.postTopicID }, { $push: { topicPosts: post.id } });
  return post;
};

/**
 * Update a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */

const updatePost = async (userId, postBody) => {
  const post = await Post.findOne({ _id: postBody.postID });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (!post.postCreatorID.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  const updatedPost = await Post.updateOne({ id: postBody.id }, postBody);
  return updatedPost;
};

const getPostById = async (postId) => {
  const post = await Post.findOne({
    _id: postId,
  }).populate('comments');
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return post;
};

const handlePostInteraction = async (userId, type, postId) => {
  if (type === 'save') {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
    if (user.savedPosts.includes(postId)) await User.updateOne({ _id: userId }, { $pull: { savedPosts: postId } }); 
    else await User.updateOne({ _id: userId }, { $push: { savedPosts: postId } });
    return;
  }
  if (type === 'like') {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    if (post.dislikes.includes(userId)) await Post.updateOne({ _id: postId }, { $pull: { dislikes: userId } });
    if (post.likes.includes(userId)) await Post.updateOne({ _id: postId }, { $pull: { likes: userId } }); 
    else await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
    return;
  }
  if (type === 'dislike') {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
    }
    if (post.likes.includes(userId)) await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
    if (post.dislikes.includes(userId)) await Post.updateOne({ _id: postId }, { $pull: { dislikes: userId } });
    else await Post.updateOne({ _id: postId }, { $push: { dislikes: userId } });
    return;
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid type');
};

const deletePost = async (userId, postId) => {
  const post = await Post.findOne({ _id: postId });
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  if (!post.postCreatorID.equals(userId)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden');
  }
  // Remove post from topic
  await Topic.updateOne({ _id: post.postTopicID }, { $pull: { topicPosts: postId } });
  // Remove comments from post
  await Comment.deleteMany({ _id: { $in: post.comments } });
  // Remove post
  await Post.deleteOne({ _id: postId });

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
