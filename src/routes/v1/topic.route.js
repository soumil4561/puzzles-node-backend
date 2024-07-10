const express = require('express');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const topicValidation = require('../../validations/topic.validation');
const topicController = require('../../controllers/topic.controller');
const { checkFileSize, fileFilter } = require('../../middlewares/fileFilter');
const { compressMedia } = require('../../utils/compressMedia');
 
const upload = multer({ fileFilter, storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  '/create-topic',
  auth(),
  upload.array('media', 2), 
  validate(topicValidation.createTopic),
  checkFileSize,
  compressMedia,
  topicController.createTopic
);
router.put('/:topicID/follow', auth(), validate(topicValidation.followTopic), topicController.followTopic);
router.get('/get-followed-topics', auth(), topicController.getFollowedTopics);
router.get('/get-all-topics', topicController.getAllTopics);
router.get('/topic/:topicName', validate(topicValidation.getTopicByName), topicController.getTopicByName);
router.get('/:topicName/about', validate(topicValidation.getTopicAbout), topicController.getTopicAbout);
router.get('/search-topic', validate(topicValidation.searchTopics), topicController.searchTopic);
router.get('/get-topic/:topicID', validate(topicValidation.getTopicByID), topicController.getTopicByID);


module.exports = router;
