const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService, mediaService } = require('../services');

const createPost = catchAsync(async (req, res) => {
  if(req.file){
    const imageURL = await mediaService.uploadMedia(req.file);
    req.body.postImageFile = imageURL;
  }
  const post = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(post);
});

const updatePost = catchAsync(async (req, res) => {
  if(req.file){
    await mediaService.deleteMedia(req.body.postImageFile);
    const imageURL = await mediaService.uploadMedia(req.file);
    req.body.postImageFile = imageURL;
  }
  const post = await postService.updatePost(req.user.id, req.body);
  res.send(post);
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  res.send(post);
});

const handlePostInteraction= catchAsync(async (req, res) => {
  const post = await postService.handlePostInteraction(req.user.id, req.body.type, req.body.postId);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.user.id, req.body.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPostsbyUser(req.user.id, req.params.page, req.params.limit);
  res.send(posts);
});

module.exports = {
  createPost,
  updatePost,
  getPostById,
  handlePostInteraction,
  deletePost,
  getPosts,
};