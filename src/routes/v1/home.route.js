const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const homeController = require("../../controllers/home.controller");
const homeValidation = require("../../validations/home.validation");

const router = express.Router();

router.get("/", auth(), homeController.getHome);
router.post("/", auth(), validate(homeValidation.getMorePosts), homeController.getMorePosts);
router.get("/about", auth(), homeController.getAbout);

module.exports = router;