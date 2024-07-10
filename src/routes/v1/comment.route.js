const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const commentValidation = require('../../validations/comment.validation');
const commentController = require('../../controllers/comment.controller');

const router = express.Router();

router.post('/create-comment', auth(), validate(commentValidation.createComment), commentController.createComment);
router.post('/like-comment/:commentID', auth(), validate(commentValidation.likeComment), commentController.likeComment);
router.post(
  '/dislike-comment/:commentID',
  auth(),
  validate(commentValidation.dislikeComment),
  commentController.dislikeComment
);
router.delete(
  '/delete-comment/:commentID',
  auth(),
  validate(commentValidation.deleteComment),
  commentController.deleteComment
);

module.exports = router;
