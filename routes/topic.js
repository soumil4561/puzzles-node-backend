const express = require('express');
const router = express.Router();
const Topic = require('../models/topic.js');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const {createTopic, joinTopic, leaveTopic} = require('../controllers/topic.js');
const {handleImages} = require('../controllers/images.js');
const {getUserFollowedTopics} = require('../controllers/home.js');


router.post("/createTopic", async (req,res) => {
    const data = JSON.parse(await handleImages(req));
    if(req.isAuthenticated()) {
    const topic = new Topic({
        topicName: data.topicName,
        topicDescription: data.topicDescription,
        topicPosts: [],
        topicFollowers: [req.user.id],
        topicCreator: req.user.id,
        topicCreated: Date.now(),
        topicPhoto: data.topicPhoto,
        topicBanner: data.topicBanner
    });
    const savedtopic = await createTopic(topic, req.user.id);
    res.send({topicName: savedtopic.topicName, topicID: savedtopic._id});
    }
    else {
        res.send("Not logged in");
    }
}); 

router.get("/:topicName", async (req, res) => {
    const topic = await Topic.findOne({topicName: req.params.topicName});
    if(topic == null) {
        res.send({
            topic: null,
            posts: null
        })
        return;
    }
    const posts = [];
    for(let i = 0; i < topic.topicPosts.length; i++) {
        const post = await Post.findOne({_id: topic.topicPosts[i]},'postTitle postContent postCreatorName postCreated postTopic postImageFile likes dislikes postTopicID');
        posts.push(post);
    }
    res.send({topic: topic, posts: posts});
});

router.post("/getUserFollowedTopics", async (req, res) => {
    if(req.isAuthenticated()) {
        const topics = await getUserFollowedTopics(req.user.id);
        res.send({topics:topics});
    }
    else {
        res.send({topics: null});
    }
});

router.get("/:topicID/userFollows", async (req, res) => {
    const topicID = req.params.topicID;
    if(req.isAuthenticated()) {
        const topicsFollowed = await User.findOne({_id: req.user.id}, 'topicsFollowed');
        if(topicsFollowed.topicsFollowed.includes(topicID)) {
            res.send({follows: true});
        }
        else {
            res.send({follows: false});
        }
    }
    else {
        res.send({follows: false});
    }
});

router.post("/:topicID/follow", async (req, res) => {
    const topicID = req.params.topicID;
    if(req.isAuthenticated()) {
        const user = req.user.id;
        if(await User.findOne({_id: user, topicsFollowed: topicID})) {
            await User.updateOne({_id: user}, {$pull: {topicsFollowed: topicID}});
            await Topic.updateOne({_id: topicID}, {$pull: {topicFollowers: user}});
            res.status(200).send({follows: false});
        }
        else {
            await User.updateOne({_id: user}, {$push: {topicsFollowed: topicID}});
            await Topic.updateOne({_id: topicID}, {$push: {topicFollowers: user}});
            res.status(200).send({follows: true});
        }
    }
    else{
        res.redirect("/login");
    } 
});

module.exports = router;