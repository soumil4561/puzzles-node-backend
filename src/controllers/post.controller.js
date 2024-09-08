const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { postService, mediaService } = require('../services');
const logger = require('../config/logger');

const createPost = catchAsync(async (req, res) => {
  try {
    req.body.postCreatorID = req.user.id;
    const post = await postService.createPost(req.body);
    if (req.file) {
      const imageURL = await mediaService.uploadPostMedia(req.file, post._id);
      logger.info(imageURL.secure_url);
      await postService.updatePost(req.user.id, { postID: post._id, postImageFile: imageURL.secure_url });
    }
    res.status(httpStatus.CREATED).send(post);

    // res.send('createPost');
  } catch (err) {
    logger.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating post');
  }
});

const updatePost = catchAsync(async (req, res) => {
  if (req.file) {
    const imageURL = await mediaService.uploadMedia(req.body.postID, req.file);
    req.body.postImageFile = imageURL;
  }
  const post = await postService.updatePost(req.user.id, req.body);
  res.send(post);
});

const getPostById = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  res.send(post);
});

const handlePostInteraction = catchAsync(async (req, res) => {
  await postService.handlePostInteraction(req.user.id, req.body.type, req.body.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePost(req.user.id, req.body.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPosts = catchAsync(async (req, res) => {
  const posts = await postService.getPostsbyUser(req.user.id, req.query.page, req.query.limit);
  res.send(posts);
});

const upload = catchAsync(async (req, res) => {
  const imageURL = await mediaService.uploadPostMedia(req.file, 1);
  res.send({ imageURL });
});

module.exports = {
  createPost,
  updatePost,
  getPostById,
  handlePostInteraction,
  deletePost,
  getPosts,
  upload,
};
