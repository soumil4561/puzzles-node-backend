const express = require('express');
const multer = require('multer');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const postValidation = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');
const { checkFileSize, fileFilter } = require('../../middlewares/fileFilter');
const { compressMedia } = require('../../utils/compressMedia');

const router = express.Router();

const upload = multer({ fileFilter, storage: multer.memoryStorage() });

// createPost
router.post(
  '/create-post',
  auth(),
  upload.single('postImageFile'),
  validate(postValidation.createPost),
  checkFileSize,
  compressMedia,
  postController.createPost
);
// updatePost
router.patch(
  '/update-post',
  auth(),

  validate(postValidation.updatePost),
  checkFileSize,
  postController.updatePost
);
// getPost (by ID)
router.get('/get-post-by-id/:postId', validate(postValidation.getPostById), postController.getPostById);
// like, dislike, save
router.post('/post-interact', auth(), validate(postValidation.handlePostInteraction), postController.handlePostInteraction);
// deletePost
router.delete('/delete-post', auth(), validate(postValidation.deletePost), postController.deletePost);
// getPosts (by user)
router.get('/get-posts', auth(), validate(postValidation.getPosts), postController.getPosts);

router.post('/upload', upload.single('file'), postController.upload);
module.exports = router;
