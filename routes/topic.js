const express = require('express');
const router = express.Router();
const Topic = require('../models/topic.js');
const User = require('../models/user.js');
const Post = require('../models/post.js');
const {createTopic, joinTopic, leaveTopic} = require('../controllers/topic.js');

router.get("/createTopic", (req, res) => {
    if(req.isAuthenticated()) {
        res.render('createTopic',{user: req.user});
    }  
    else {
        res.redirect('/auth/login');
    }
});

router.post("/createTopic", (req,res) => {
    const topic = new Topic({
        topicName: req.body.topicName,
        topicDescription: req.body.topicDescription,
        topicPosts: [],
        topicFollowers: [req.user.id],
        topicCreator: req.user.id,
        topicCreated: Date.now()

    });
    if(req.body.topicPhoto != null) {
        topic.topicPhoto = req.body.topicPhoto;
    }
    if(req.body.topicBanner != null) {
        topic.topicBanner = req.body.topicBanner;
    }
    const savedtopic = createTopic(topic, req.user.id);
    res.redirect('/topic/'+topic.topicName);
}); 

router.get("/:topicName", async (req, res) => {
    let user;
    if(req.isAuthenticated()) {
        user = await User.findOne({_id: req.user.id});
    }
    else {
        user = null;
    }
    try {
        const topicName = req.params.topicName;
        const topic = await Topic.findOne({topicName: topicName});
        const posts = await Post.find({postTopic: topicName}).sort({postCreated: -1}).limit(10);
        res.render('topic.ejs',{topic: topic, posts: posts, user: user});
    } catch (error) {
        console.log(error);
    }
});

router.post("/follow", async (req, res) => {
    const topicID = req.body.topicID;
    const type = req.body.type;
    if(req.isAuthenticated()) {
        if(type == "leave"){
            return leaveTopic(topicID,req.user.id);
        }
        else if(type == "join") return joinTopic(topicID,req.user.id);
    }
    else {
        res.redirect('/auth/login');
    }
});

module.exports = router;