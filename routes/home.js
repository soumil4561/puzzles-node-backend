const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");
const Topic = require("../models/topic.js");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const { getUserFollowedTopics, getPosts } = require("../controllers/home.js");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id });
    const topics = await getUserFollowedTopics(req.user.id);
    const userData = {
      username: user.username,
      email: user.email,
      id: user.id,
      profilePhoto: user.profilePhoto,
      topicsFollowed: topics
    }
    const posts = await getPosts(topics);
    console.log(posts);
    res.send({ topics: topics, posts: posts, user: userData });
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/home/profile", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id });
    const topics = getUserFollowedTopics(req.user.id);
    const posts = await Post.find({ postCreatorID: req.user.id });
    res.send({ topics: topics, posts: posts, user: user });
  } else {
    res.redirect("/auth/login");
  }
});

router.get("/home/liked", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id });
    const posts = await Post.find({ _id: { $in: user.postsLiked } });
    const topics = await getUserFollowedTopics(req.user.id);
    res.send({ posts: posts, user: user, topics: topics });
  } else {
    res.redirect("/auth/login");
  }
});

module.exports = router;
