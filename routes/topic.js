const express = require('express');
const router = express.Router();
const Topic = require('../models/topic.js');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const {createTopic, joinTopic, leaveTopic} = require('../controllers/topic.js');
const {handleImages} = require('../controllers/images.js');

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

router.post("/follow", async (req, res) => {
});

module.exports = router;