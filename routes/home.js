const express = require("express");
const router = express.Router();
const mongoose = require("../config/db");
const Topic = require("../models/topic.js");
const Post = require("../models/post.js");
const User = require("../models/user.js");
const { getUserFollowedTopics, getInitialPosts, getMorePosts } = require("../controllers/home.js");



router.get("/", (req, res) => {
  res.redirect("/home");
});

router.get("/home", async (req, res) => {
  if (req.isAuthenticated()) {
      const user = await User.findOne({ _id: req.user.id });
      const topics = await getUserFollowedTopics(req.user.id);
      const topicName = [];
      topics.map((topic) => {
        topicName.push(topic.topicName);
      });
      const posts = await getInitialPosts(topicName);
      
      res.send({ posts: posts, user: user, topics: topics });
  } else {
    res.send("Bad Request");
  }
});

router.post("/home", async (req, res) => {
  if (req.isAuthenticated()) {
    const userID = req.user.id;
    console.log(req.body);
    const lastPostIDTime = req.body.lastPostIDTime;
    const topics = await getUserFollowedTopics(userID);
    const topicName = [];
      topics.map((topic) => {
        topicName.push(topic.topicName);
      });
    const posts = await getMorePosts(topics, lastPostIDTime);
    
    res.send({ posts: posts });
  } 
  else {
    res.send("Bad Request");
  }
});

router.get("/home/about", async (req, res) => {
  if(req.isAuthenticated()){
    const userID = req.user.id;
    const data = await User.findOne({_id: userID},'username topicsFollowed postsCreated topicsCreated');
    data.topicsFollowed = data.topicsFollowed.length;
    data.postsCreated = data.postsCreated.length;
    data.topicsCreated = data.topicsCreated.length;
    res.status(200).send(data);
  }
});



router.get("/home/liked", async (req, res) => {
  if (req.isAuthenticated()) {
    const user = await User.findOne({ _id: req.user.id });
    const posts = await Post.find({ _id: { $in: user.postsLiked } });
    const topics = await getUserFollowedTopics(req.user.id);
    res.send({ posts: posts, user: user, topics: topics });
  } else {
    res.redirect("Bad Request");
  }
});

module.exports = router;