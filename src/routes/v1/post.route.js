const express = require('express');
const multer = require('multer');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const postValidation = require('../../validations/post.validation');
const postController = require('../../controllers/post.controller');
const { checkFileSize } = require('../../middlewares/fileFilter');
// const { compressMedia } = require('../../utils/compressMedia');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const extArray = file.mimetype.split('/');
    const extension = extArray[extArray.length - 1];
    cb(null, `${file.fieldname}-${Date.now()}.${extension}`);
  }
});

const upload = multer({storage});

// createPost
router.post(
  '/create-post',
  auth(),
  upload.single('postImageFile'),
  validate(postValidation.createPost),
  checkFileSize,
  // compressMedia,
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