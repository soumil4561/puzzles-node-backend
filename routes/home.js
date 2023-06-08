const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");
const Topic = require("../models/topic.js");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const Session = require("../models/session.js");
const { getUserFollowedTopics, getPosts } = require("../controllers/home.js");

router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", async (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id });
    const topics = await getUserFollowedTopics(req.user.id);
    const posts = await getPosts(topics);
    
    res.send({ posts: posts, user: user, topics: topics });
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
